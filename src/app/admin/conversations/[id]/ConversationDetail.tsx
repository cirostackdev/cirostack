"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow, format, isSameDay } from "date-fns";
import { useSwipeToReply } from "@/components/Chat/useSwipeToReply";
import {
  Send, ArrowLeft, UserCheck, X, Info, FileText, MessageSquare, Paperclip, Trash2,
  Search, Clipboard, Reply, CheckCheck, Check, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { getPusher } from "@/lib/pusher-client";
import type { Channel } from "pusher-js";
import { TypingIndicator } from "@/components/Chat/TypingIndicator";
import { DateSeparator } from "@/components/Chat/DateSeparator";
import { ReplyPreview } from "@/components/Chat/ReplyPreview";
import { ImageLightbox } from "@/components/Chat/ImageLightbox";
import { PRESENCE, CONVERSATION_STATUS_COLORS } from "@/lib/colors";

const REACTION_EMOJIS = ["👍", "❤️", "😊", "🙏", "✅"];

interface Message {
  id: string;
  senderType: string;
  senderName: string | null;
  body: string;
  fileUrl: string | null;
  read: boolean;
  replyToId?: string | null;
  replyToBody?: string | null;
  replyToSender?: string | null;
  reactions?: Record<string, string[]> | null;
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

function highlightText(text: string, search: string) {
  if (!search) return <>{text}</>;
  const parts = text.split(new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === search.toLowerCase() ? (
          <mark key={i} className="bg-yellow-300/70 text-foreground rounded-sm px-0.5">{part}</mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function isGroupedWith(msg: Message, prev: Message | null | undefined): boolean {
  if (!prev) return false;
  if (msg.senderType !== prev.senderType) return false;
  const diff = new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime();
  return diff < 2 * 60 * 1000;
}

function MessageBubble({
  msg,
  prevMsg,
  visitorName,
  convId,
  onReply,
  onDelete,
  search,
  isFirstUnread,
}: {
  msg: Message;
  prevMsg: Message | null;
  visitorName: string | null;
  convId: string;
  onReply: (m: Message) => void;
  onDelete: (id: string) => void;
  search: string;
  isFirstUnread: boolean;
}) {
  const isSystem = msg.senderType === "system";
  const isAgent = msg.senderType === "agent";
  const time = format(new Date(msg.createdAt), "HH:mm");
  const grouped = isGroupedWith(msg, prevMsg);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const { bubbleRef, iconRef, onTouchStart, onTouchMove, onTouchEnd } = useSwipeToReply(
    () => onReply(msg)
  );

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
    try {
      await fetch(`/api/admin/conversations/${convId}/messages/${msg.id}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });
    } catch {}
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.body).catch(() => {});
  };

  // Read receipt for agent messages
  const readReceipt = isAgent ? (
    msg.read
      ? <CheckCheck className="w-3 h-3 text-blue-400 inline ml-0.5" />
      : <Check className="w-3 h-3 opacity-40 inline ml-0.5" />
  ) : null;

  const reactionDisplay = reactions && Object.keys(reactions).length > 0 ? (
    <div className={`flex flex-wrap gap-1 mt-1 ${isAgent ? "justify-end" : "justify-start"}`}>
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

      {isFirstUnread && (
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-primary/30" />
          <span className="text-[11px] text-primary font-semibold whitespace-nowrap">new messages</span>
          <div className="flex-1 h-px bg-primary/30" />
        </div>
      )}

      <div className={`flex ${isAgent ? "justify-end" : "justify-start"} ${grouped ? "mb-0.5" : "mb-3"} group relative`}>
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
          className={`max-w-[85%] sm:max-w-[72%] flex flex-col ${isAgent ? "items-end" : "items-start"}`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {!grouped && !isAgent && (
            <p className="text-[11px] font-semibold text-muted-foreground mb-1 px-1">
              {visitorName || "Visitor"}
            </p>
          )}

          {/* Context menu bar */}
          <div className={`absolute ${isAgent ? "right-0" : "left-0"} -top-8 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center gap-0.5 bg-background border border-border rounded-lg shadow-md px-1 py-0.5`}>
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
            <button onClick={() => onReply(msg)} className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground" title="Reply">
              <Reply className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete(msg.id)} className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-destructive" title="Delete">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {isImage ? (
            <div className={`p-2 rounded-2xl ${isAgent ? "bg-green-500/10 rounded-tr-md" : "bg-muted/60 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-tl-md"}`}>
              <img
                src={msg.fileUrl!}
                alt="attachment"
                className="rounded-xl max-w-full max-h-52 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setLightboxSrc(msg.fileUrl!)}
              />
              <p className={`text-[10px] mt-1.5 opacity-60 ${isAgent ? "text-right" : "text-left"}`}>{time}</p>
            </div>
          ) : isFile ? (
            <div className={`p-3.5 rounded-2xl ${isAgent ? "bg-green-500/10 rounded-tr-md" : "bg-muted/60 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-tl-md"} max-w-[220px] w-full`}>
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
                ? `bg-green-500 text-white rounded-l-2xl rounded-tr-2xl ${grouped ? "rounded-br-sm rounded-tr-sm" : "rounded-br-md"}`
                : `bg-muted/80 border border-border/40 shadow-[0_2px_10px_rgba(0,0,0,0.06)] text-foreground rounded-r-2xl rounded-tl-2xl ${grouped ? "rounded-bl-sm rounded-tl-sm" : "rounded-bl-md"}`
            }`}>
              {msg.replyToBody && (
                <ReplyPreview
                  senderName={msg.replyToSender || "Unknown"}
                  body={msg.replyToBody}
                />
              )}
              <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {highlightText(msg.body, search)}
              </p>
              <p className={`text-[10px] mt-1 opacity-50 flex items-center gap-1 ${isAgent ? "justify-end" : "justify-start"}`}>
                {time}
                {readReceipt}
              </p>
            </div>
          )}

          {reactionDisplay}
        </div>
      </div>
    </>
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
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [unreadWhileScrolled, setUnreadWhileScrolled] = useState(0);
  const channelRef = useRef<Channel | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrolledUpRef = useRef(false);

  // Find the first unread visitor message index
  const firstUnreadIdx = initialMessages.findIndex(
    (m) => m.senderType === "visitor" && !m.read
  );

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
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [messages, visitorTyping]);

  // Subscribe to Pusher channel + claim conversation
  useEffect(() => {
    const pusher = getPusher();
    if (!pusher) {
      fetch(`/api/admin/conversations/${conversation.id}/claim`, { method: "POST" }).catch(() => {});
      fetch(`/api/admin/conversations/${conversation.id}/read`, { method: "POST" }).catch(() => {});
      return;
    }
    const channel = pusher.subscribe(`private-conversation-${conversation.id}`);
    channelRef.current = channel;

    channel.bind("new-message", ({ message }: { message: Message }) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === message.id)) return prev;
        if (isScrolledUpRef.current && message.senderType === "visitor") {
          setUnreadWhileScrolled((n) => n + 1);
        }
        return [...prev, message];
      });
    });

    channel.bind("visitor-typing", ({ typing }: { typing: boolean }) => {
      setVisitorTyping(typing);
    });

    channel.bind("conversation-closed", () => {
      setStatus("closed");
    });

    channel.bind("reaction-update", ({ messageId, reactions }: { messageId: string; reactions: Record<string, string[]> }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, reactions } : m))
      );
    });

    channel.bind("messages-read", ({ by }: { by: string }) => {
      if (by === "visitor") {
        setMessages((prev) =>
          prev.map((m) =>
            m.senderType === "agent" ? { ...m, read: true } : m
          )
        );
      }
    });

    // Claim conversation and mark read
    fetch(`/api/admin/conversations/${conversation.id}/claim`, { method: "POST" }).catch(() => {});
    fetch(`/api/admin/conversations/${conversation.id}/read`, { method: "POST" }).catch(() => {});

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      channel.unbind_all();
      pusher?.unsubscribe(`private-conversation-${conversation.id}`);
    };
  }, [conversation.id]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const body = input.trim();
    setInput("");
    inputRef.current?.focus();

    const payload: Record<string, unknown> = { body };
    if (replyTo) {
      payload.replyToId = replyTo.id;
      payload.replyToBody = replyTo.body;
      payload.replyToSender = replyTo.senderName || (replyTo.senderType === "agent" ? adminName : "Visitor");
    }
    setReplyTo(null);

    const res = await fetch(`/api/admin/conversations/${conversation.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      toast.error("Failed to send message");
    }
  };

  const handleTyping = (val: string) => {
    setInput(val);
    fetch(`/api/admin/conversations/${conversation.id}/typing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ typing: val.length > 0 }),
    }).catch(() => {});

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      fetch(`/api/admin/conversations/${conversation.id}/typing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ typing: false }),
      }).catch(() => {});
    }, 3000);
  };

  const closeConversation = async () => {
    await fetch(`/api/admin/conversations/${conversation.id}/close`, { method: "POST" });
    setStatus("closed");
  };

  async function reopenConversation() {
    const res = await fetch(`/api/admin/conversations/${conversation.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "open" }),
    });
    if (res.ok) setStatus("open");
  }

  async function deleteConversation() {
    if (!confirm("Delete this conversation? This cannot be undone.")) return;
    await fetch(`/api/admin/conversations/${conversation.id}`, { method: "DELETE" });
    router.push("/admin/conversations");
  }

  async function deleteMessage(msgId: string) {
    if (!confirm("Delete this message?")) return;
    try {
      await fetch(`/api/admin/conversations/${conversation.id}/messages/${msgId}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
    } catch {
      toast.error("Failed to delete message");
    }
  }

  const initials = conversation.visitorName
    ? conversation.visitorName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  // Filter messages by search, build date-separated list
  const filteredMessages = messages.filter(
    (m) => !search || m.body.toLowerCase().includes(search.toLowerCase())
  );

  const messageItems: Array<
    | { type: "separator"; date: Date }
    | { type: "message"; msg: Message; prev: Message | null; isFirstUnread: boolean }
  > = [];
  let lastDate: Date | null = null;
  let lastMsg: Message | null = null;

  for (let i = 0; i < filteredMessages.length; i++) {
    const msg = filteredMessages[i];
    const msgDate = new Date(msg.createdAt);
    if (!lastDate || !isSameDay(lastDate, msgDate)) {
      messageItems.push({ type: "separator", date: msgDate });
      lastDate = msgDate;
    }
    const isFirstUnread = !search && messages.indexOf(msg) === firstUnreadIdx;
    messageItems.push({ type: "message", msg, prev: lastMsg, isFirstUnread });
    lastMsg = msg;
  }

  return (
    <div className="flex h-full">
      {/* Thread */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-border">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background sticky top-0 z-10">
          <button onClick={() => router.back()} className="lg:hidden min-w-[36px] min-h-[36px] flex items-center justify-center -ml-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
              {initials}
            </div>
            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ${status === "open" ? PRESENCE.online : PRESENCE.offline}`} />
          </div>

          <div className="flex-1 min-w-0">
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search messages…"
                  className="flex-1 text-sm bg-muted border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary"
                />
                <button onClick={() => { setSearch(""); setSearchOpen(false); }} className="text-muted-foreground hover:text-foreground p-1 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <p className="font-semibold text-sm truncate">
                  {conversation.visitorName || "Anonymous visitor"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {conversation.topic || "No topic"} · {formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {!searchOpen && (
              <button onClick={() => setSearchOpen(true)} title="Search messages"
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
                <Search className="w-4 h-4" />
              </button>
            )}
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${
              CONVERSATION_STATUS_COLORS[status] ?? "bg-muted text-muted-foreground"
            }`}>
              {status}
            </span>
            {status === "open" && (
              <button onClick={closeConversation} title="Close conversation"
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
            <button onClick={deleteConversation} title="Delete conversation"
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-muted rounded-full transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={() => setSidebarOpen((v) => !v)}
              className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-4 py-4 relative"
          onScroll={handleScroll}
        >
          {filteredMessages.length === 0 && !search && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">No messages yet</p>
            </div>
          )}

          {filteredMessages.length === 0 && search && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <p className="text-sm text-muted-foreground">No messages matching "{search}"</p>
            </div>
          )}

          {messageItems.map((item, idx) => {
            if (item.type === "separator") {
              return <DateSeparator key={`sep-${item.date.toISOString()}-${idx}`} date={item.date} />;
            }
            if (item.msg.senderType === "system") {
              return (
                <div key={item.msg.id} className="flex justify-center my-3">
                  <span className="text-[11px] text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/40">
                    {item.msg.body}
                  </span>
                </div>
              );
            }
            return (
              <MessageBubble
                key={item.msg.id}
                msg={item.msg}
                prevMsg={item.prev}
                visitorName={conversation.visitorName}
                convId={conversation.id}
                onReply={setReplyTo}
                onDelete={deleteMessage}
                search={search}
                isFirstUnread={item.isFirstUnread}
              />
            );
          })}

          {visitorTyping && <TypingIndicator />}
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
                {replyTo.senderName || (replyTo.senderType === "agent" ? adminName : "Visitor")}
              </p>
              <p className="text-xs truncate text-muted-foreground">{replyTo.body}</p>
            </div>
            <button onClick={() => setReplyTo(null)} className="shrink-0 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Input */}
        {status === "open" ? (
          <div className="border-t border-border px-3 py-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
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
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*,application/pdf"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append("file", file);
                  try {
                    const res = await fetch("/api/admin/chat-upload", { method: "POST", body: formData });
                    if (!res.ok) { toast.error("Upload failed"); return; }
                    const { url, name } = await res.json();
                    await fetch(`/api/admin/conversations/${conversation.id}/messages`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ body: name, fileUrl: url }),
                    });
                  } catch {
                    toast.error("Upload failed");
                  }
                  e.target.value = "";
                }}
              />
            </div>
          </div>
        ) : (
          <div className="border-t border-border px-4 py-3 bg-muted/20 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">This conversation is closed.</p>
            <button onClick={reopenConversation} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Reopen</button>
          </div>
        )}
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={`${sidebarOpen ? "flex" : "hidden"} lg:flex w-72 lg:w-60 shrink-0 flex-col fixed lg:static right-0 inset-y-0 z-20 lg:z-auto bg-background border-l border-border overflow-y-auto`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3 lg:block">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Visitor Info</p>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden min-w-[36px] min-h-[36px] flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
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
              <span className="text-xs font-medium text-green-500">{assignedTo.name}</span>
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
