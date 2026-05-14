"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getSocket, disconnectSocket } from "@/lib/socket";
import type { Socket } from "socket.io-client";

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
  const socketRef = useRef<Socket | null>(null);
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

  const connectSocket = useCallback(
    (convId: string, visitorData?: { name?: string; email?: string; topic?: string }) => {
      const socket = getSocket();
      socketRef.current = socket;

      socket.off("connect");
      socket.off("connect_error");
      socket.off("conversation:created");
      socket.off("agent:message");
      socket.off("agent:typing");
      socket.off("agent:online");
      socket.off("conversation:closed");
      socket.off("disconnect");

      const doJoin = () => {
        setStatus("connected");
        const visitorId = getVisitorId();
        socket.emit("visitor:join", {
          visitorId,
          conversationId: convId || undefined,
          name: visitorData?.name,
          email: visitorData?.email,
          topic: visitorData?.topic,
          pageUrl: window.location.href,
        });
      };

      socket.on("connect", doJoin);

      // Fall back to offline mode on connection error
      socket.on("connect_error", () => {
        setStatus("offline");
        setAgentOnline(false);
      });

      socket.on("conversation:created", ({ conversationId: cid }: { conversationId: string }) => {
        setConversationId(cid);
        setStoredConversationId(cid);
      });

      socket.on("agent:message", ({ message }: { message: ChatMessage }) => {
        setMessages((prev) => {
          if (prev.find((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
        setAgentTyping(false);
      });

      socket.on("agent:typing", ({ typing }: { typing: boolean }) => {
        setAgentTyping(typing);
      });

      socket.on("agent:online", ({ online }: { online: boolean }) => {
        setAgentOnline(online);
      });

      socket.on("conversation:closed", () => {
        setStatus("idle");
      });

      socket.on("disconnect", () => {
        setStatus("idle");
      });

      if (socket.connected) {
        // Already connected — join immediately
        doJoin();
      } else {
        setStatus("connecting");
        socket.connect();

        // 8-second timeout: if still not connected, fall back to offline mode
        const timeout = setTimeout(() => {
          if (socketRef.current && !socketRef.current.connected) {
            setStatus("offline");
            setAgentOnline(false);
          }
        }, 8000);

        socket.once("connect", () => clearTimeout(timeout));
        socket.once("connect_error", () => clearTimeout(timeout));
      }
    },
    []
  );

  const openChat = useCallback(() => {
    setIsOpen(true);
    const existingConvId = getStoredConversationId();

    if (existingConvId) {
      setConversationId(existingConvId);
      loadHistory(existingConvId);
      connectSocket(existingConvId);
    } else {
      if (!agentOnline) {
        // Offline mode - no pre-chat form needed, show email form
        return;
      }
      setShowPreChat(true);
    }
  }, [agentOnline, loadHistory, connectSocket]);

  const startChat = useCallback(
    (visitorData: { name?: string; email?: string; topic?: string }) => {
      setShowPreChat(false);
      connectSocket("", visitorData);
    },
    [connectSocket]
  );

  const sendMessage = useCallback(
    (body: string) => {
      if (!body.trim() || !conversationId) return;

      const socket = socketRef.current;
      if (!socket?.connected) return;

      const optimistic: ChatMessage = {
        id: `opt-${Date.now()}`,
        conversationId,
        senderType: "visitor",
        body: body.trim(),
        read: false,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimistic]);
      socket.emit("visitor:message", { conversationId, body });
    },
    [conversationId]
  );

  const sendTyping = useCallback(
    (typing: boolean) => {
      if (!conversationId || !socketRef.current?.connected) return;
      socketRef.current.emit("visitor:typing", { conversationId, typing });

      if (typing) {
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => {
          socketRef.current?.emit("visitor:typing", { conversationId, typing: false });
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
    setConversationId(null);
    setMessages([]);
    disconnectSocket();
    setStatus("idle");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
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
