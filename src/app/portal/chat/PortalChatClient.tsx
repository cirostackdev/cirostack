"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Send, Paperclip, MessageSquare, Plus, ChevronLeft, FileText, Clipboard, Reply, Check, CheckCheck, Clock, X, ChevronDown } from "lucide-react";
import { format, formatDistanceToNow, isSameDay } from "date-fns";
import { TypingIndicator } from "@/components/Chat/TypingIndicator";
import { DateSeparator } from "@/components/Chat/DateSeparator";
import { ReplyPreview } from "@/components/Chat/ReplyPreview";
import { ImageLightbox } from "@/components/Chat/ImageLightbox";
import { useSwipeToReply } from "@/components/Chat/useSwipeToReply";
import { CONVERSATION_STATUS_COLORS, PRESENCE } from "@/lib/colors";

const REACTION_EMOJIS = ["👍", "❤️", "😊", "🙏", "✅"];

interface Message {
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
  // client-only
  status?: "sending" | "sent" | "failed";
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

function Bubble({
  msg,
  prevMsg,
  convId,
  clientName,
  onReply,
}: {
  msg: Message;
  prevMsg: Message | null;
  convId: string | null;
  clientName: string;
  onReply?: (m: Message) => void;
}) {
  const isAgent = msg.senderType === "agent";
  const isSystem = msg.senderType === "system";
  const time = format(new Date(msg.createdAt), "HH:mm");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const { bubbleRef, iconRef, onTouchStart, onTouchMove, onTouchEnd } = useSwipeToReply(
    () => onReply?.(msg)
  );

  const grouped = (() => {
    if (!prevMsg) return false;
    if (msg.senderType !== prevMsg.senderType) return false;
    return new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() < 2 * 60 * 1000;
  })();

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

  const reactions = msg.reactions as Record<string, string[]> | null | undefined;

  const handleReact = async (emoji: string) => {
    if (!convId) return;
    try {
      await fetch(`/api/chat/conversations/${convId}/messages/${msg.id}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });
    } catch {}
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.body).catch(() => {});
  };

  // Status icon for visitor messages
  const statusIcon = !isAgent ? (
    msg.status === "sending" ? (
      <Clock className="w-3 h-3 opacity-50 inline" />
    ) : msg.status === "failed" ? (
      <X className="w-3 h-3 text-red-400 inline" />
    ) : msg.read ? (
      <CheckCheck className="w-3 h-3 text-blue-400 inline" />
    ) : (
      <Check className="w-3 h-3 opacity-50 inline" />
    )
  ) : null;

  const reactionDisplay = reactions && Object.keys(reactions).length > 0 ? (
    <div className={`flex flex-wrap gap-1 mt-1 ${isAgent ? "justify-start" : "justify-end"}`}>
      {Object.entries(reactions).map(([emoji, ids]) =>
        ids.length > 0 ? (
          <button
            key={emoji}
            onClick={() => handleReact(emoji)}
            className="text-[11px] bg-muted/70 border border-border/40 rounded-full px-1.5 py-0.5 hover:bg-muted transition-colors"
          >
            {emoji} {ids.length}
          </button>
        ) : null
      )}
    </div>
  ) : null;

  return (
    <>
      {lightboxSrc && <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}

      <div className={`flex ${isAgent ? "justify-start" : "justify-end"} ${grouped ? "mb-0.5" : "mb-3"} group relative`}>
        {/* Swipe-to-reply icon */}
        <div
          ref={iconRef}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 opacity-0 text-muted-foreground pointer-events-none"
          style={{ transform: "scale(0.6)" }}
        >
          <Reply className="w-5 h-5" />
        </div>

        <div
          ref={bubbleRef}
          className={`max-w-[75%] flex flex-col ${isAgent ? "items-start" : "items-end"}`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {!grouped && isAgent && msg.senderName && (
            <p className="text-[11px] font-semibold text-muted-foreground mb-1 px-1">{msg.senderName}</p>
          )}

          {/* Context menu */}
          <div className={`absolute ${isAgent ? "left-0" : "right-0"} -top-8 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center gap-0.5 bg-background border border-border rounded-lg shadow-md px-1 py-0.5`}>
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReact(emoji)}
                className="text-sm px-1 py-0.5 hover:bg-muted rounded transition-colors"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
            <div className="w-px h-4 bg-border mx-0.5" />
            <button onClick={handleCopy} className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground" title="Copy">
              <Clipboard className="w-3.5 h-3.5" />
            </button>
            {onReply && (
              <button onClick={() => onReply(msg)} className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground" title="Reply">
                <Reply className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {isImage ? (
            <div className={`p-2 rounded-2xl ${isAgent ? "bg-muted/60 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-tl-md" : "bg-green-500/10 rounded-tr-md"}`}>
              <img
                src={msg.fileUrl!}
                alt="attachment"
                className="rounded-xl max-w-full max-h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setLightboxSrc(msg.fileUrl!)}
              />
              <p className="text-[10px] mt-1.5 opacity-60">{time}</p>
            </div>
          ) : isFile ? (
            <div className={`p-3.5 rounded-2xl ${isAgent ? "bg-muted/60 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-tl-md" : "bg-green-500/10 rounded-tr-md"} max-w-[220px] w-full`}>
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
                ? `bg-muted/80 border border-border/40 shadow-[0_2px_10px_rgba(0,0,0,0.06)] text-foreground rounded-r-2xl rounded-tl-2xl ${grouped ? "rounded-bl-sm rounded-tl-sm" : "rounded-bl-md"}`
                : `bg-green-500 text-white rounded-l-2xl rounded-tr-2xl ${grouped ? "rounded-br-sm rounded-tr-sm" : "rounded-br-md"}`
            }`}>
              {msg.replyToBody && (
                <ReplyPreview senderName={msg.replyToSender || "Unknown"} body={msg.replyToBody} />
              )}
              <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.body}</p>
              <p className={`text-[10px] mt-1 opacity-50 flex items-center gap-1 ${isAgent ? "justify-start" : "justify-end"}`}>
                {time}
                {statusIcon}
              </p>
            </div>
          )}

          {reactionDisplay}
        </div>
      </div>
    </>
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
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [unreadWhileScrolled, setUnreadWhileScrolled] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef<string | null>(initialConversation?.id ?? null);
  const lastMessageIdRef = useRef<string | null>(
    initialConversation?.messages.at(-1)?.id ?? null
  );
  const isScrolledUpRef = useRef(false);

  // Check agent online status
  useEffect(() => {
    const check = () => fetch("/api/chat/status").then((r) => r.json()).then((d) => setAgentOnline(d.online)).catch(() => {});
    check();
    const t = setInterval(check, 30_000);
    return () => clearInterval(t);
  }, []);

  // Mark agent messages as read
  useEffect(() => {
    const cid = conversationIdRef.current;
    if (!cid) return;
    fetch(`/api/chat/conversations/${cid}/read`, { method: "POST" }).catch(() => {});
  }, [messages]);

  // Poll for new messages every 3 seconds (delta fetch using after param)
  useEffect(() => {
    const poll = async () => {
      const afterParam = lastMessageIdRef.current ? `?after=${lastMessageIdRef.current}` : "";
      const res = await fetch(`/api/portal/chat${afterParam}`);
      if (!res.ok) return;
      const { conversation: conv } = await res.json();
      if (!conv) return;

      const isNewConversation = conversationIdRef.current && conv.id !== conversationIdRef.current;

      // Conversation switched — reset everything so old messages don't mix in
      if (isNewConversation) {
        lastMessageIdRef.current = null;
        setMessages(conv.messages);
        setUnreadWhileScrolled(0);
        conversationIdRef.current = conv.id;
        setConversation(conv);
        if (conv.messages.length > 0) {
          lastMessageIdRef.current = conv.messages.at(-1)?.id ?? null;
        }
        return;
      }

      conversationIdRef.current = conv.id;
      setConversation(conv);

      // Append only new messages (delta fetch returns only messages after the last known one)
      if (conv.messages.length > 0) {
        const latestId = conv.messages.at(-1)?.id;
        if (lastMessageIdRef.current) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newMsgs = conv.messages.filter((m: Message) => !existingIds.has(m.id));
            if (newMsgs.length > 0 && isScrolledUpRef.current) {
              const agentNew = newMsgs.filter((m: Message) => m.senderType === "agent").length;
              if (agentNew > 0) setUnreadWhileScrolled((n) => n + agentNew);
            }
            return newMsgs.length > 0 ? [...prev, ...newMsgs] : prev;
          });
        } else {
          setMessages(conv.messages);
        }
        if (latestId) lastMessageIdRef.current = latestId;
      }
    };

    poll();
    const t = setInterval(poll, 3000);
    return () => clearInterval(t);
  }, []);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isUp = el.scrollTop + el.clientHeight < el.scrollHeight - 100;
    setShowScrollBtn(isUp);
    isScrolledUpRef.current = isUp;
    if (!isUp) setUnreadWhileScrolled(0);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollBtn(false);
    isScrolledUpRef.current = false;
    setUnreadWhileScrolled(0);
  };

  useEffect(() => {
    if (!isScrolledUpRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const body = input.trim();
    setInput("");
    setSending(true);

    const optimistic: Message = {
      id: `opt-${Date.now()}`,
      conversationId: conversationIdRef.current ?? "",
      senderType: "visitor",
      senderName: clientName || null,
      body,
      read: false,
      createdAt: new Date().toISOString(),
      status: "sending",
      replyToId: replyTo?.id,
      replyToBody: replyTo?.body,
      replyToSender: replyTo?.senderName || (replyTo?.senderType === "agent" ? "Agent" : undefined),
    };
    setMessages((prev) => [...prev, optimistic]);
    setReplyTo(null);

    const payload: Record<string, unknown> = {
      body,
      conversationId: conversationIdRef.current,
    };
    if (replyTo) {
      payload.replyToId = replyTo.id;
      payload.replyToBody = replyTo.body;
      payload.replyToSender = replyTo.senderName || (replyTo.senderType === "agent" ? "Agent" : clientName || "You");
    }

    try {
      const res = await fetch("/api/portal/chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const { message, conversationId: cid } = await res.json();
        conversationIdRef.current = cid;
        lastMessageIdRef.current = message.id;
        setMessages((prev) => prev.map((m) => m.id === optimistic.id ? { ...message, status: "sent" } : m));
      } else {
        setMessages((prev) => prev.map((m) => m.id === optimistic.id ? { ...m, status: "failed" } : m));
      }
    } catch {
      setMessages((prev) => prev.map((m) => m.id === optimistic.id ? { ...m, status: "failed" } : m));
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
      await fetch("/api/portal/chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: "Sent a file", fileUrl: url, conversationId: conversationIdRef.current }),
      });
    }
    e.target.value = "";
  };

  const startNewConversation = async () => {
    if (conversationIdRef.current && conversation?.status === "open") {
      await fetch("/api/portal/chat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: conversationIdRef.current }),
      }).catch(() => {});
    }
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

  // Build date-separated message list
  const messageItems: Array<
    | { type: "separator"; date: Date }
    | { type: "message"; msg: Message; prev: Message | null }
  > = [];
  let lastDate: Date | null = null;
  let lastMsgForGroup: Message | null = null;

  for (const msg of messages) {
    const msgDate = new Date(msg.createdAt);
    if (!lastDate || !isSameDay(lastDate, msgDate)) {
      messageItems.push({ type: "separator", date: msgDate });
      lastDate = msgDate;
    }
    messageItems.push({ type: "message", msg, prev: lastMsgForGroup });
    lastMsgForGroup = msg;
  }

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
              <span className={`inline-block w-[76px] text-center text-xs px-2 py-0.5 rounded-full font-medium ${CONVERSATION_STATUS_COLORS[c.status] ?? "bg-muted text-muted-foreground"}`}>
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
            <span className={`inline-block w-[76px] text-center text-xs px-2 py-0.5 rounded-full font-semibold ${CONVERSATION_STATUS_COLORS.open}`}>active</span>
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
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 relative"
        onScroll={handleScroll}
      >
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

        {messageItems.map((item, idx) => {
          if (item.type === "separator") {
            return <DateSeparator key={`sep-${item.date.toISOString()}-${idx}`} date={item.date} />;
          }
          return (
            <Bubble
              key={item.msg.id}
              msg={item.msg}
              prevMsg={item.prev}
              convId={conversationIdRef.current}
              clientName={clientName}
              onReply={setReplyTo}
            />
          );
        })}

        {isClosed && (
          <div className="flex justify-center my-4">
            <span className="text-[11px] text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/40">
              This conversation was closed
            </span>
          </div>
        )}

        <div ref={bottomRef} />

        {/* Scroll to bottom */}
        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity z-10"
            aria-label="Scroll to bottom"
          >
            {unreadWhileScrolled > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadWhileScrolled > 9 ? "9+" : unreadWhileScrolled}
              </span>
            )}
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Reply bar */}
      {replyTo && (
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-t border-border/40">
          <div className="flex-1 min-w-0 border-l-2 border-primary/60 pl-2">
            <p className="text-[10px] font-semibold text-muted-foreground">
              {replyTo.senderName || (replyTo.senderType === "agent" ? "Agent" : "You")}
            </p>
            <p className="text-xs truncate text-muted-foreground">{replyTo.body}</p>
          </div>
          <button onClick={() => setReplyTo(null)} className="shrink-0 text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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
