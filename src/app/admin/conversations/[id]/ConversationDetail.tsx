"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import { Send, ArrowLeft, UserCheck, X, Info, FileText, MessageSquare, Paperclip } from "lucide-react";
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

function MessageBubble({ msg, visitorName }: { msg: Message; visitorName: string | null }) {
  const isSystem = msg.senderType === "system";
  const isAgent = msg.senderType === "agent";
  const time = format(new Date(msg.createdAt), "HH:mm");

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <span className="text-[11px] text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/40">
          {msg.body}
        </span>
      </div>
    );
  }

  const isImage = msg.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isFile = msg.fileUrl && !isImage;

  return (
    <div className={`flex ${isAgent ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-[72%] flex flex-col ${isAgent ? "items-end" : "items-start"}`}>
        {!isAgent && (
          <p className="text-[11px] font-semibold text-muted-foreground mb-1 px-1">
            {visitorName || "Visitor"}
          </p>
        )}

        {isImage ? (
          <div className={`p-2 rounded-2xl ${isAgent ? "bg-primary/10 rounded-tr-md" : "bg-muted/60 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-tl-md"}`}>
            <img src={msg.fileUrl!} alt="attachment" className="rounded-xl max-w-full max-h-52 object-cover" />
            <p className={`text-[10px] mt-1.5 opacity-60 ${isAgent ? "text-right" : "text-left"}`}>{time}</p>
          </div>
        ) : isFile ? (
          <div className={`p-3.5 rounded-2xl ${isAgent ? "bg-primary/10 rounded-tr-md" : "bg-muted/60 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-tl-md"} max-w-[220px] w-full`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-background rounded-xl shadow-sm flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-foreground" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <a href={msg.fileUrl!} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold truncate block hover:underline">
                  View attachment
                </a>
                <p className="text-[10px] text-muted-foreground mt-0.5">Document</p>
              </div>
            </div>
            <p className={`text-[10px] mt-2 opacity-60 ${isAgent ? "text-right" : "text-left"}`}>{time}</p>
          </div>
        ) : (
          <div className={`px-4 py-2.5 text-sm leading-relaxed ${
            isAgent
              ? "bg-primary text-primary-foreground rounded-l-2xl rounded-tr-2xl rounded-br-md"
              : "bg-muted/80 border border-border/40 shadow-[0_2px_10px_rgba(0,0,0,0.06)] text-foreground rounded-r-2xl rounded-tl-2xl rounded-bl-md"
          }`}>
            <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.body}</p>
            <p className={`text-[10px] mt-1 opacity-50 ${isAgent ? "text-right" : "text-left"}`}>{time}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ConversationDetail({ conversation, initialMessages, adminId, adminName }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [visitorTyping, setVisitorTyping] = useState(false);
  const [status, setStatus] = useState(conversation.status);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assignedTo, setAssignedTo] = useState(conversation.assignedTo);
  const [admins, setAdmins] = useState<{ id: string; name: string }[]>([]);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/admin/admins").then((r) => r.ok ? r.json() : []).then((data) => {
      if (Array.isArray(data)) setAdmins(data);
    }).catch(() => {});
  }, []);

  async function handleAssign(aId: string) {
    const res = await fetch(`/api/admin/conversations/${conversation.id}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId: aId || null }),
    });
    if (res.ok) {
      const data = await res.json();
      setAssignedTo(data.assignedTo);
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages, visitorTyping]);

  useEffect(() => {
    const sendHeartbeat = () => fetch("/api/chat/heartbeat", { method: "POST" }).catch(() => {});
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

      const doJoin = () => {
        socket.emit("admin:join", { token });
        socket.emit("admin:read", { conversationId: conversation.id });
      };

      // Always re-register handlers for this conversation
      socket.off("connect");
      socket.off("conversations:list");
      socket.off("visitor:message");
      socket.off("agent:message");
      socket.off("visitor:typing");
      socket.off("conversation:closed");

      socket.on("connect", doJoin);

      socket.on("conversations:list", () => {
        // Server sends this after admin:join — use it to claim the conversation room
        socket.emit("admin:claim", { conversationId: conversation.id });
      });

      socket.on("visitor:message", ({ message }: { message: Message }) => {
        setMessages((prev) => prev.find((m) => m.id === message.id) ? prev : [...prev, message]);
      });
      socket.on("agent:message", ({ message }: { message: Message }) => {
        setMessages((prev) => prev.find((m) => m.id === message.id) ? prev : [...prev, message]);
      });
      socket.on("visitor:typing", ({ typing }: { typing: boolean }) => setVisitorTyping(typing));
      socket.on("conversation:closed", () => setStatus("closed"));

      if (socket.connected) {
        // Already connected — emit admin:join immediately.
        // Server will respond with conversations:list which triggers admin:claim.
        doJoin();
      } else {
        socket.connect();
      }
    };

    init();
    return () => { if (typingTimerRef.current) clearTimeout(typingTimerRef.current); };
  }, [conversation.id]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current?.connected) return;
    socketRef.current.emit("admin:message", { conversationId: conversation.id, body: input.trim() });
    setInput("");
    inputRef.current?.focus();
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

  const initials = conversation.visitorName
    ? conversation.visitorName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="flex h-full">
      {/* Thread */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-border">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background sticky top-0 z-10">
          <button onClick={() => router.back()} className="p-1.5 -ml-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
              {initials}
            </div>
            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ${status === "open" ? "bg-green-500" : "bg-muted-foreground/40"}`} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">
              {conversation.visitorName || "Anonymous visitor"}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {conversation.topic || "No topic"} · {formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${
              status === "open" ? "bg-green-500/15 text-green-500" : "bg-muted text-muted-foreground"
            }`}>
              {status}
            </span>
            {status === "open" && (
              <button onClick={closeConversation} title="Close conversation"
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => setSidebarOpen((v) => !v)}
              className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">No messages yet</p>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} visitorName={conversation.visitorName} />
          ))}
          {visitorTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {status === "open" ? (
          <div className="border-t border-border px-3 py-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-muted/50 border border-border rounded-full px-3 h-11 gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => handleTyping(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } }}
                  placeholder="Reply…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="w-11 h-11 bg-primary text-primary-foreground rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*,application/pdf" />
            </div>
          </div>
        ) : (
          <div className="border-t border-border px-4 py-3 bg-muted/20">
            <p className="text-xs text-muted-foreground text-center">This conversation is closed.</p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "flex" : "hidden"} lg:flex w-full lg:w-60 shrink-0 flex-col absolute lg:static inset-0 z-10 bg-background border-l border-border`}>
        <div className="p-4 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Visitor Info</p>
          <div className="bg-muted/40 rounded-xl p-3 space-y-2">
            <InfoRow label="Name" value={conversation.visitorName || "—"} />
            <InfoRow label="Email" value={conversation.visitorEmail || "—"} />
            <InfoRow label="Topic" value={conversation.topic || "—"} />
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Assignment</p>
          {assignedTo ? (
            <div className="flex items-center gap-1.5 mb-2.5 bg-green-500/10 rounded-lg px-2.5 py-2">
              <UserCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
              <span className="text-xs font-medium text-green-600">{assignedTo.name}</span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mb-2.5">Unassigned</p>
          )}
          {admins.length > 0 && (
            <select
              value={assignedTo?.id ?? ""}
              onChange={(e) => handleAssign(e.target.value)}
              className="w-full text-xs bg-muted border border-border rounded-lg px-2.5 py-2 outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Unassigned</option>
              {admins.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          )}
        </div>
      </aside>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-[11px] text-muted-foreground shrink-0">{label}</span>
      <span className="text-[11px] font-medium text-right truncate">{value}</span>
    </div>
  );
}
