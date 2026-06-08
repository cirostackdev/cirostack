"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Send, Paperclip, MessageSquare, Plus, ChevronLeft, FileText } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { TypingIndicator } from "@/components/Chat/TypingIndicator";
import { CONVERSATION_STATUS_COLORS, PRESENCE } from "@/lib/colors";

interface Message {
  id: string;
  conversationId: string;
  senderType: "visitor" | "agent" | "system";
  senderName?: string | null;
  body: string;
  fileUrl?: string | null;
  read: boolean;
  createdAt: string;
}

interface Conversation {
  id: string;
  status: string;
  topic: string | null;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  assignedTo: { name: string } | null;
}

interface Props {
  clientId: string;
  clientName: string;
  clientEmail: string;
  initialConversation: Conversation | null;
}

function Bubble({ msg }: { msg: Message }) {
  const isAgent = msg.senderType === "agent";
  const isSystem = msg.senderType === "system";
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
    <div className={`flex ${isAgent ? "justify-start" : "justify-end"} mb-3`}>
      <div className={`max-w-[75%] flex flex-col ${isAgent ? "items-start" : "items-end"}`}>
        {isAgent && msg.senderName && (
          <p className="text-[11px] font-semibold text-muted-foreground mb-1 px-1">{msg.senderName}</p>
        )}
        {isImage ? (
          <div className={`p-2 rounded-2xl ${isAgent ? "bg-muted/60 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-tl-md" : "bg-primary/10 rounded-tr-md"}`}>
            <img src={msg.fileUrl!} alt="attachment" className="rounded-xl max-w-full max-h-48 object-cover" />
            <p className="text-[10px] mt-1.5 opacity-60">{time}</p>
          </div>
        ) : isFile ? (
          <div className={`p-3.5 rounded-2xl ${isAgent ? "bg-muted/60 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-tl-md" : "bg-primary/10 rounded-tr-md"} max-w-[220px] w-full`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-background rounded-xl shadow-sm flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-foreground" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <a href={msg.fileUrl!} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold truncate block hover:underline">View attachment</a>
                <p className="text-[10px] text-muted-foreground mt-0.5">Document</p>
              </div>
            </div>
            <p className="text-[10px] mt-2 opacity-60">{time}</p>
          </div>
        ) : (
          <div className={`px-4 py-2.5 text-sm leading-relaxed ${
            isAgent
              ? "bg-muted/80 border border-border/40 shadow-[0_2px_10px_rgba(0,0,0,0.06)] text-foreground rounded-r-2xl rounded-tl-2xl rounded-bl-md"
              : "bg-primary text-primary-foreground rounded-l-2xl rounded-tr-2xl rounded-br-md"
          }`}>
            <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.body}</p>
            <p className={`text-[10px] mt-1 opacity-50 ${isAgent ? "text-left" : "text-right"}`}>{time}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function PortalChatClient({ clientId, clientName, clientEmail, initialConversation }: Props) {
  const [conversation, setConversation] = useState<Conversation | null>(initialConversation);
  const [messages, setMessages] = useState<Message[]>(initialConversation?.messages ?? []);
  const [agentOnline, setAgentOnline] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [view, setView] = useState<"chat" | "history">("chat");
  const [history, setHistory] = useState<Conversation[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const conversationIdRef = useRef<string | null>(initialConversation?.id ?? null);
  const lastMessageIdRef = useRef<string | null>(
    initialConversation?.messages.at(-1)?.id ?? null
  );

  // Check agent online status
  useEffect(() => {
    const check = () => fetch("/api/chat/status").then((r) => r.json()).then((d) => setAgentOnline(d.online)).catch(() => {});
    check();
    const t = setInterval(check, 30_000);
    return () => clearInterval(t);
  }, []);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    const poll = async () => {
      const res = await fetch("/api/portal/chat");
      if (!res.ok) return;
      const { conversation: conv } = await res.json();
      if (!conv) return;

      conversationIdRef.current = conv.id;
      setConversation(conv);

      // Only update if there are new messages
      const latestId = conv.messages.at(-1)?.id;
      if (latestId && latestId !== lastMessageIdRef.current) {
        lastMessageIdRef.current = latestId;
        setMessages(conv.messages);
      }
    };

    poll(); // immediate on mount
    const t = setInterval(poll, 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const body = input.trim();
    setInput("");
    setSending(true);

    // Optimistic update
    const optimistic: Message = {
      id: `opt-${Date.now()}`,
      conversationId: conversationIdRef.current ?? "",
      senderType: "visitor",
      senderName: clientName || null,
      body,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await fetch("/api/portal/chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, conversationId: conversationIdRef.current }),
      });
      if (res.ok) {
        const { message, conversationId: cid } = await res.json();
        conversationIdRef.current = cid;
        lastMessageIdRef.current = message.id;
        // Replace optimistic with real message
        setMessages((prev) => prev.map((m) => m.id === optimistic.id ? message : m));
      }
    } catch {
      // Remove optimistic on error
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    }

    setSending(false);
    inputRef.current?.focus();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/chat/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      const body = url;
      await fetch("/api/portal/chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, conversationId: conversationIdRef.current }),
      });
    }
    e.target.value = "";
  };

  const startNewConversation = async () => {
    conversationIdRef.current = null;
    lastMessageIdRef.current = null;
    setConversation(null);
    setMessages([]);
  };

  const loadHistory = async () => {
    setView("history");
    setHistoryLoading(true);
    const res = await fetch("/api/portal/chat", { method: "POST" });
    if (res.ok) {
      const { conversations } = await res.json();
      setHistory(conversations);
    }
    setHistoryLoading(false);
  };

  const isClosed = conversation?.status === "closed";

  // History view
  if (view === "history") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <button onClick={() => setView("chat")} className="p-1.5 -ml-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="font-semibold text-sm">Conversation History</h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border/50">
          {historyLoading && (
            <div className="space-y-1 p-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-start gap-3 px-4 py-4 animate-pulse">
                  <div className="mt-1 w-2 h-2 rounded-full bg-muted shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!historyLoading && history.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No past conversations.</p>
          )}
          {history.map((c) => (
            <button key={c.id}
              onClick={() => { setConversation(c); setMessages(c.messages); conversationIdRef.current = c.id; lastMessageIdRef.current = c.messages.at(-1)?.id ?? null; setView("chat"); }}
              className="w-full flex items-start gap-3 px-4 py-4 hover:bg-muted/40 transition-colors text-left">
              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${c.status === "open" ? PRESENCE.online : PRESENCE.offline}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{c.topic || "Support conversation"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {c.messages.length} message{c.messages.length !== 1 ? "s" : ""} · {formatDistanceToNow(new Date(c.updatedAt), { addSuffix: true })}
                </p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${CONVERSATION_STATUS_COLORS[c.status] ?? "bg-muted text-muted-foreground"}`}>
                {c.status}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background sticky top-0 z-10">
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ${agentOnline ? PRESENCE.online : PRESENCE.offline}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">CiroStack Support</p>
          <p className="text-[11px] text-muted-foreground">
            {agentOnline ? "Online · Usually replies in minutes" : "Offline · We'll reply as soon as possible"}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {conversation && !isClosed && (
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${CONVERSATION_STATUS_COLORS.open}`}>active</span>
          )}
          <button onClick={loadHistory}
            className="text-xs font-medium px-2.5 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
            History
          </button>
          {(isClosed || !conversation) && (
            <button onClick={startNewConversation}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity">
              <Plus className="w-3.5 h-3.5" /> New chat
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 px-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Chat with CiroStack</p>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-xs">
                Have a question about your project or invoice? Send us a message and we'll get back to you.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <Bubble key={msg.id} msg={msg} />
        ))}

        {isClosed && (
          <div className="flex justify-center my-4">
            <span className="text-[11px] text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/40">
              This conversation was closed
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!isClosed ? (
        <div className="border-t border-border px-3 py-3 pb-[max(12px,env(safe-area-inset-bottom))] shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-muted/50 border border-border rounded-full px-3 h-11 gap-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } }}
                placeholder="Type a message…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoComplete="off"
                enterKeyHint="send"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0 p-1"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              className="w-11 h-11 bg-primary text-primary-foreground rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileUpload} />
          </div>
        </div>
      ) : (
        <div className="border-t border-border px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] bg-muted/20 flex items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-muted-foreground">This conversation is closed.</p>
          <button onClick={startNewConversation}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity shrink-0 min-h-[36px]">
            <Plus className="w-3.5 h-3.5" /> New chat
          </button>
        </div>
      )}
    </div>
  );
}
