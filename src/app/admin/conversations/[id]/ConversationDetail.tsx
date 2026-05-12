"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import { Send, ArrowLeft, UserCheck, X } from "lucide-react";
import { getSocket } from "@/lib/socket";
import { TypingIndicator } from "@/components/Chat/TypingIndicator";

interface Message {
  id: string;
  senderType: string;
  senderName: string | null;
  body: string;
  fileUrl: string | null;
  createdAt: string;
}

interface Conversation {
  id: string;
  visitorName: string | null;
  visitorEmail: string | null;
  topic: string | null;
  status: string;
  createdAt: string;
  assignedTo: { id: string; name: string } | null;
}

interface Props {
  conversation: Conversation;
  initialMessages: Message[];
  adminId: string;
  adminName: string;
}

export function ConversationDetail({ conversation, initialMessages, adminId, adminName }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [visitorTyping, setVisitorTyping] = useState(false);
  const [claimed, setClaimed] = useState(!!conversation.assignedTo);
  const [status, setStatus] = useState(conversation.status);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages, visitorTyping]);

  // Heartbeat while admin has a conversation open
  useEffect(() => {
    const sendHeartbeat = () =>
      fetch("/api/chat/heartbeat", { method: "POST" }).catch(() => {});
    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const init = async () => {
      const tokenRes = await fetch("/api/chat/socket-token", { method: "POST" });
      if (!tokenRes.ok) return;
      const { token } = await tokenRes.json();

      const socket = getSocket();
      socketRef.current = socket;
      socket.connect();

      socket.on("connect", () => {
        socket.emit("admin:join", { token });
        socket.emit("admin:read", { conversationId: conversation.id });
      });

      socket.on("conversations:list", () => {
        // After joining, claim this conversation room
        socket.emit("admin:claim", { conversationId: conversation.id });
      });

      socket.on("visitor:message", ({ message }: { message: Message }) => {
        setMessages((prev) => {
          if (prev.find((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
      });

      socket.on("agent:message", ({ message }: { message: Message }) => {
        setMessages((prev) => {
          if (prev.find((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
      });

      socket.on("visitor:typing", ({ typing }: { typing: boolean }) => {
        setVisitorTyping(typing);
      });

      socket.on("conversation:closed", () => {
        setStatus("closed");
      });
    };

    init();

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [conversation.id]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current?.connected) return;
    socketRef.current.emit("admin:message", {
      conversationId: conversation.id,
      body: input.trim(),
    });
    setInput("");
  };

  const handleTyping = (val: string) => {
    setInput(val);
    if (!socketRef.current?.connected) return;
    socketRef.current.emit("admin:typing", { conversationId: conversation.id, typing: val.length > 0 });
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socketRef.current?.emit("admin:typing", { conversationId: conversation.id, typing: false });
    }, 3000);
  };

  const closeConversation = () => {
    socketRef.current?.emit("admin:close", { conversationId: conversation.id });
    setStatus("closed");
  };

  return (
    <div className="flex h-full">
      {/* Thread */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-border">
        {/* Thread header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <button
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {conversation.visitorName || "Anonymous visitor"}
            </p>
            <p className="text-xs text-muted-foreground">
              {conversation.topic || "No topic"} ·{" "}
              {formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                status === "open"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {status}
            </span>
            {status === "open" && (
              <button
                onClick={closeConversation}
                title="Close conversation"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {messages.map((msg) => {
            const isSystem = msg.senderType === "system";
            const isAgent = msg.senderType === "agent";

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center">
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {msg.body}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex ${isAgent ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${
                    isAgent
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {!isAgent && (
                    <p className="text-xs font-semibold opacity-60 mb-0.5">
                      {conversation.visitorName || "Visitor"}
                    </p>
                  )}
                  <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.body}</p>
                  <p className={`text-[10px] mt-1 opacity-50 ${isAgent ? "text-right" : ""}`}>
                    {format(new Date(msg.createdAt), "HH:mm")}
                  </p>
                </div>
              </div>
            );
          })}
          {visitorTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {status === "open" && (
          <div className="border-t border-border p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => handleTyping(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Reply…"
                rows={1}
                className="flex-1 resize-none bg-muted rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary max-h-32 overflow-y-auto"
                style={{ fieldSizing: "content" } as any}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="p-2.5 bg-primary text-primary-foreground rounded-xl disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar: visitor info */}
      <aside className="w-56 shrink-0 p-4 space-y-4 text-sm">
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Visitor</p>
          <div className="space-y-1.5">
            <InfoRow label="Name" value={conversation.visitorName || "—"} />
            <InfoRow label="Email" value={conversation.visitorEmail || "—"} />
            <InfoRow label="Topic" value={conversation.topic || "—"} />
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Assignment</p>
          {conversation.assignedTo ? (
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs">{conversation.assignedTo.name}</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Unassigned</span>
          )}
        </div>
      </aside>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-muted-foreground">{label}: </span>
      <span className="text-xs font-medium">{value}</span>
    </div>
  );
}
