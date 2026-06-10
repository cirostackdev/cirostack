"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getPusher } from "@/lib/pusher-client";
import type { Channel } from "pusher-js";

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderType: "visitor" | "agent" | "system";
  senderName?: string | null;
  body: string;
  fileUrl?: string | null;
  read: boolean;
  createdAt: string;
}

export type ChatStatus = "idle" | "connecting" | "connected" | "offline";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("ciro_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("ciro_visitor_id", id);
  }
  return id;
}

function getStoredConversationId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ciro_conv_id");
}

function setStoredConversationId(id: string) {
  localStorage.setItem("ciro_conv_id", id);
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [agentOnline, setAgentOnline] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showPreChat, setShowPreChat] = useState(false);
  const channelRef = useRef<Channel | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Poll online status every 30 seconds
  useEffect(() => {
    const checkOnline = async () => {
      try {
        const res = await fetch("/api/chat/status");
        const data = await res.json();
        setAgentOnline(data.online);
      } catch {
        setAgentOnline(false);
      }
    };

    checkOnline();
    const interval = setInterval(checkOnline, 30_000);
    return () => clearInterval(interval);
  }, []);

  // Visitor presence heartbeat — fires every 60s while chat is open
  useEffect(() => {
    if (!isOpen || !conversationId) return;
    const beat = () =>
      fetch(`/api/chat/conversations/${conversationId}/heartbeat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: getVisitorId() }),
      }).catch(() => {});
    beat();
    const interval = setInterval(beat, 60_000);
    return () => clearInterval(interval);
  }, [isOpen, conversationId]);

  // Subscribe to Pusher channel for a conversation
  const subscribe = useCallback((convId: string) => {
    const pusher = getPusher();
    if (!pusher) { setStatus("offline"); return; }

    if (channelRef.current) {
      channelRef.current.unbind_all();
      pusher.unsubscribe(channelRef.current.name);
    }

    const channel = pusher.subscribe(`private-conversation-${convId}`);
    channelRef.current = channel;

    channel.bind("pusher:subscription_succeeded", () => {
      setStatus("connected");
    });

    channel.bind("pusher:subscription_error", () => {
      setStatus("offline");
    });

    channel.bind("new-message", ({ message }: { message: ChatMessage }) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === message.id)) return prev;
        // Reconcile optimistic message
        const optimisticIdx = prev.findIndex(
          (m) => m.id.startsWith("opt-") && m.body === message.body && m.conversationId === message.conversationId
        );
        if (optimisticIdx !== -1) {
          const updated = [...prev];
          updated[optimisticIdx] = message;
          return updated;
        }
        return [...prev, message];
      });
      if (message.senderType === "agent") setAgentTyping(false);
    });

    channel.bind("agent-typing", ({ typing }: { typing: boolean }) => {
      setAgentTyping(typing);
    });

    channel.bind("conversation-closed", () => {
      setStatus("idle");
    });
  }, []);

  // Load history for returning visitors when opening chat
  const loadHistory = useCallback(async (convId: string) => {
    const visitorId = getVisitorId();
    try {
      const res = await fetch(
        `/api/chat/conversations/${convId}/messages?visitorId=${visitorId}`
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {}
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
    const existingConvId = getStoredConversationId();

    if (existingConvId) {
      setConversationId(existingConvId);
      loadHistory(existingConvId);
      setStatus("connecting");
      subscribe(existingConvId);
    } else {
      if (!agentOnline) {
        // Offline mode - no pre-chat form needed, show email form
        return;
      }
      setShowPreChat(true);
    }
  }, [agentOnline, loadHistory, subscribe]);

  const startChat = useCallback(
    async (visitorData: { name?: string; email?: string; topic?: string }) => {
      setShowPreChat(false);
      setStatus("connecting");

      try {
        const res = await fetch("/api/chat/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId: getVisitorId(),
            name: visitorData.name,
            email: visitorData.email,
            topic: visitorData.topic,
            pageUrl: window.location.href,
          }),
        });

        if (!res.ok) {
          setStatus("offline");
          return;
        }

        const { conversationId: cid } = await res.json();
        setConversationId(cid);
        setStoredConversationId(cid);
        subscribe(cid);

        // Load the welcome message
        await loadHistory(cid);
      } catch {
        setStatus("offline");
      }
    },
    [subscribe, loadHistory]
  );

  const sendMessage = useCallback(
    async (body: string) => {
      if (!body.trim() || !conversationId) return;

      const optimistic: ChatMessage = {
        id: `opt-${Date.now()}`,
        conversationId,
        senderType: "visitor",
        body: body.trim(),
        read: false,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimistic]);

      try {
        const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId: getVisitorId(), body }),
        });

        if (!res.ok) {
          // Remove optimistic on failure
          setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        }
        // Server response triggers Pusher event which reconciles the optimistic message
      } catch {
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      }
    },
    [conversationId]
  );

  const sendTyping = useCallback(
    (typing: boolean) => {
      if (!conversationId) return;

      fetch(`/api/chat/conversations/${conversationId}/typing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ typing }),
      }).catch(() => {});

      if (typing) {
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => {
          fetch(`/api/chat/conversations/${conversationId}/typing`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ typing: false }),
          }).catch(() => {});
        }, 3000);
      }
    },
    [conversationId]
  );

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setShowPreChat(false);
  }, []);

  const resetConversation = useCallback(() => {
    localStorage.removeItem("ciro_conv_id");
    if (channelRef.current) {
      channelRef.current.unbind_all();
      getPusher()?.unsubscribe(channelRef.current.name);
      channelRef.current = null;
    }
    setConversationId(null);
    setMessages([]);
    setStatus("idle");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (channelRef.current) {
        channelRef.current.unbind_all();
        getPusher()?.unsubscribe(channelRef.current.name);
      }
    };
  }, []);

  return {
    messages,
    status,
    agentOnline,
    agentTyping,
    conversationId,
    isOpen,
    showPreChat,
    openChat,
    closeChat,
    startChat,
    sendMessage,
    sendTyping,
    resetConversation,
  };
}
