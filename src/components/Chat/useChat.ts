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
  replyToId?: string | null;
  replyToBody?: string | null;
  replyToSender?: string | null;
  reactions?: Record<string, string[]> | null;
  createdAt: string;
  // Client-only optimistic status
  status?: "sending" | "sent" | "failed" | "uploading";
  uploadProgress?: number; // 0-100
  fileType?: string; // MIME type for blob URL rendering
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
  const [agentRecording, setAgentRecording] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showPreChat, setShowPreChat] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const channelRef = useRef<Channel | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const convIdRef = useRef<string | null>(null);
  // Track messages received while scrolled away
  const [unreadWhileScrolled, setUnreadWhileScrolled] = useState(0);
  const isScrolledUpRef = useRef(false);

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

  // Mark agent messages as read when chat is open
  useEffect(() => {
    if (!isOpen || !conversationId) return;
    fetch(`/api/chat/conversations/${conversationId}/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});
  }, [isOpen, conversationId, messages]);

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
          updated[optimisticIdx] = { ...message, status: "sent" };
          return updated;
        }
        // Count unread while scrolled
        if (isScrolledUpRef.current && message.senderType === "agent") {
          setUnreadWhileScrolled((n) => n + 1);
        }
        return [...prev, message];
      });
      if (message.senderType === "agent") { setAgentTyping(false); setAgentRecording(false); }
    });

    channel.bind("agent-typing", ({ typing }: { typing: boolean }) => {
      setAgentTyping(typing);
    });

    channel.bind("agent-recording", ({ recording }: { recording: boolean }) => {
      setAgentRecording(recording);
    });

    channel.bind("conversation-closed", () => {
      setStatus("idle");
    });

    channel.bind("reaction-update", ({ messageId, reactions }: { messageId: string; reactions: Record<string, string[]> }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, reactions } : m))
      );
    });

    channel.bind("messages-read", ({ by }: { by: string }) => {
      if (by === "admin") {
        setMessages((prev) =>
          prev.map((m) =>
            m.senderType === "visitor" ? { ...m, read: true } : m
          )
        );
      }
    });

    channel.bind("message-deleted", ({ messageId }: { messageId: string }) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    });
  }, []);

  // Load history for returning visitors when opening chat
  const loadHistory = useCallback(async (convId: string): Promise<boolean> => {
    const visitorId = getVisitorId();
    try {
      const res = await fetch(
        `/api/chat/conversations/${convId}/messages?visitorId=${visitorId}`
      );
      if (res.ok) {
        const data = await res.json();
        // If conversation is closed, clear it from storage so next open starts fresh
        if (data.status === "closed") {
          localStorage.removeItem("ciro_conv_id");
          return false;
        }
        setMessages((data.messages || []).map((m: ChatMessage) => ({ ...m, status: "sent" })));
        return true;
      }
    } catch {}
    return false;
  }, []);

  const openChat = useCallback(async () => {
    setIsOpen(true);
    const existingConvId = getStoredConversationId();

    if (existingConvId) {
      // Load history first — returns false if conversation was closed
      const valid = await loadHistory(existingConvId);
      if (valid) {
        setConversationId(existingConvId);
        convIdRef.current = existingConvId;
        setStatus("connecting");
        subscribe(existingConvId);
      } else {
        // Conversation was closed — show pre-chat for a fresh start
        setConversationId(null);
        convIdRef.current = null;
        setMessages([]);
        if (agentOnline) setShowPreChat(true);
      }
    } else {
      if (!agentOnline) {
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
        convIdRef.current = cid;
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
    async (body: string, options?: { replyToId?: string; replyToBody?: string; replyToSender?: string }, fileUrl?: string) => {
      if (!body.trim() || !conversationId) return;

      const optimistic: ChatMessage = {
        id: `opt-${Date.now()}`,
        conversationId,
        senderType: "visitor",
        body: body.trim(),
        fileUrl: fileUrl ?? null,
        read: false,
        createdAt: new Date().toISOString(),
        status: "sending",
        replyToId: options?.replyToId,
        replyToBody: options?.replyToBody,
        replyToSender: options?.replyToSender,
      };

      setMessages((prev) => [...prev, optimistic]);

      try {
        const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId: getVisitorId(),
            body,
            fileUrl: fileUrl ?? undefined,
            replyToId: options?.replyToId,
            replyToBody: options?.replyToBody,
            replyToSender: options?.replyToSender,
          }),
        });

        if (!res.ok) {
          setMessages((prev) =>
            prev.map((m) => (m.id === optimistic.id ? { ...m, status: "failed" } : m))
          );
        }
        // Server response triggers Pusher event which reconciles the optimistic message
      } catch {
        setMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? { ...m, status: "failed" } : m))
        );
      }
    },
    [conversationId]
  );

  const sendFile = useCallback(
    async (file: File, uploadEndpoint: string) => {
      if (!conversationId) return;

      const localUrl = URL.createObjectURL(file);
      const optId = `opt-${Date.now()}`;

      const optimistic: ChatMessage = {
        id: optId,
        conversationId,
        senderType: "visitor",
        body: file.name,
        fileUrl: localUrl,
        fileType: file.type,
        read: false,
        createdAt: new Date().toISOString(),
        status: "uploading",
        uploadProgress: 0,
      };

      setMessages((prev) => [...prev, optimistic]);

      try {
        // Upload with XHR for progress
        const remoteUrl = await new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", uploadEndpoint);

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 100);
              setMessages((prev) =>
                prev.map((m) => (m.id === optId ? { ...m, uploadProgress: pct } : m))
              );
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const data = JSON.parse(xhr.responseText);
              resolve(data.url);
            } else {
              reject(new Error("Upload failed"));
            }
          };
          xhr.onerror = () => reject(new Error("Upload failed"));

          const fd = new FormData();
          fd.append("file", file);
          xhr.send(fd);
        });

        // Upload done — update to "sending" and send the message
        setMessages((prev) =>
          prev.map((m) => (m.id === optId ? { ...m, fileUrl: remoteUrl, status: "sending", uploadProgress: undefined } : m))
        );
        URL.revokeObjectURL(localUrl);

        const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId: getVisitorId(),
            body: file.name,
            fileUrl: remoteUrl,
          }),
        });

        if (!res.ok) {
          setMessages((prev) =>
            prev.map((m) => (m.id === optId ? { ...m, status: "failed" } : m))
          );
        }
      } catch {
        URL.revokeObjectURL(localUrl);
        setMessages((prev) =>
          prev.map((m) => (m.id === optId ? { ...m, status: "failed", uploadProgress: undefined } : m))
        );
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

  const sendRecording = useCallback(
    (recording: boolean) => {
      if (!conversationId) return;
      fetch(`/api/chat/conversations/${conversationId}/recording`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recording }),
      }).catch(() => {});
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
    convIdRef.current = null;
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
    agentRecording,
    conversationId,
    isOpen,
    showPreChat,
    replyTo,
    setReplyTo,
    unreadWhileScrolled,
    setUnreadWhileScrolled,
    isScrolledUpRef,
    openChat,
    closeChat,
    startChat,
    sendMessage,
    sendFile,
    sendTyping,
    sendRecording,
    resetConversation,
  };
}
