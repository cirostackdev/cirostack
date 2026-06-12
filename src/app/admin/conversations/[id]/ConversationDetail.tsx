"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow, format, isSameDay } from "date-fns";
import { useSwipeToReply } from "@/components/Chat/useSwipeToReply";
import {
  Send, ArrowLeft, UserCheck, X, Info, FileText, MessageSquare, Paperclip, Trash2,
  Search, Clipboard, Reply, CheckCheck, Check, ChevronDown, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { getPusher } from "@/lib/pusher-client";
import type { Channel } from "pusher-js";
import { TypingIndicator } from "@/components/Chat/TypingIndicator";
import { RecordingIndicator } from "@/components/Chat/RecordingIndicator";
import { DateSeparator } from "@/components/Chat/DateSeparator";
import { ReplyPreview } from "@/components/Chat/ReplyPreview";
import { MediaBubble } from "@/components/Chat/MediaBubble";
import { LinkPreview } from "@/components/Chat/LinkPreview";
import { MediaPickerPopup, type SpecialPickType } from "@/components/Chat/MediaPickerPopup";
import { isStructuredMessage, StructuredMessageCard } from "@/components/Chat/StructuredMessageCard";
import { VoiceNoteButton } from "@/components/Chat/VoiceNoteButton";
import { CatalogPicker } from "@/components/Chat/CatalogPicker";
import { ContactPicker } from "@/components/Chat/ContactPicker";
import { EventPicker } from "@/components/Chat/EventPicker";
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
  // Client-only optimistic fields
  status?: "sending" | "sent" | "failed" | "uploading";
  uploadProgress?: number;
  fileType?: string;
}

const VISITOR_TTL_MS = 2 * 60 * 1000;

function computeVisitorOnline(metadata: Record<string, unknown> | null | undefined): boolean {
  const ts = metadata?.visitorLastSeen as string | undefined;
  if (!ts) return false;
  return Date.now() - new Date(ts).getTime() < VISITOR_TTL_MS;
}

interface Conversation {
  id: string;
  visitorName: string | null;
  visitorEmail: string | null;
  topic: string | null;
  status: string;
  createdAt: string;
  metadata?: Record<string, unknown> | null;
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
  onSeen,
  search,
  isFirstUnread,
}: {
  msg: Message;
  prevMsg: Message | null;
  visitorName: string | null;
  convId: string;
  onReply: (m: Message) => void;
  onDelete: (id: string) => void;
  onSeen: (msgId: string, type: "listened" | "watched" | "clicked") => void;
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
  const structured = !msg.fileUrl && isStructuredMessage(msg.body);

  const linkMatch = !msg.fileUrl && !structured ? msg.body.match(/(?:https?:\/\/[^\s]+|(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:com|org|net|io|dev|co|ai|app|me|info|biz|xyz|tech|site|online|store|shop)(?:\/[^\s]*)?)/i) : null;
  const linkUrl = linkMatch ? (linkMatch[0].match(/^https?:\/\//) ? linkMatch[0] : `https://${linkMatch[0]}`) : null;
  const [ogLoaded, setOgLoaded] = useState(false);
  const bodyWithoutUrl = linkMatch ? msg.body.replace(linkMatch[0], "").trim() : msg.body;

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

  // Tick icons for agent messages (agent = sender in admin view)
  const rxn = (msg.reactions ?? {}) as Record<string, unknown>;
  const isAudioMsg = !!msg.fileUrl && (
    (msg as any).fileType?.startsWith("audio/") ||
    msg.body?.startsWith("voice-note-") ||
    /\.(mp3|mp4a|wav|aac|m4a|webm|ogg)(\?|$)/i.test(msg.fileUrl) ||
    msg.fileUrl.includes("audio/")
  );
  const isVideoMsg = !isAudioMsg && !!msg.fileUrl && (
    (msg as any).fileType?.startsWith("video/") ||
    /\.(mp4|webm|ogg|mov)(\?|$)/i.test(msg.fileUrl) ||
    msg.fileUrl.includes("video/")
  );
  const hasLink = !!linkUrl || structured;

  const interacted = isAudioMsg ? !!rxn._listened : isVideoMsg ? !!rxn._watched : hasLink ? !!rxn._clicked : msg.read;

  const readReceipt = isAgent ? (
    msg.status === "uploading" || msg.status === "sending"
      ? <Clock className="w-3 h-3 opacity-40 inline ml-0.5" />
      : msg.status === "failed"
      ? <X className="w-3 h-3 text-red-400 inline ml-0.5" />
      : interacted
      ? <CheckCheck className="w-3 h-3 text-blue-400 inline ml-0.5" />
      : <Check className="w-3 h-3 opacity-40 inline ml-0.5" />
  ) : null;

  const visibleReactions = reactions ? Object.fromEntries(Object.entries(reactions).filter(([k]) => !k.startsWith("_"))) : {};
  const reactionDisplay = Object.keys(visibleReactions).length > 0 ? (
    <div className={`flex flex-wrap gap-1 mt-1 ${isAgent ? "justify-end" : "justify-start"}`}>
      {Object.entries(visibleReactions).map(([emoji, ids]) =>
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

          {msg.fileUrl ? (
            <div>
              <MediaBubble
                fileUrl={msg.fileUrl}
                fileName={msg.body}
                isSender={isAgent}
                fileType={(msg as any).fileType}
                uploadProgress={(msg as any).uploadProgress}
                onListen={!isAgent ? () => onSeen(msg.id, "listened") : undefined}
                onWatch={!isAgent ? () => onSeen(msg.id, "watched") : undefined}
              />
              <p className={`text-[10px] mt-1 opacity-50 flex items-center gap-1 ${isAgent ? "justify-end" : "justify-start"}`}>
                {time}{readReceipt}
              </p>
            </div>
          ) : (
            <div className={`${structured ? "p-3" : "px-4 py-2.5"} text-sm leading-relaxed ${
              isAgent
                ? `bg-green-500/10 text-foreground rounded-l-2xl rounded-tr-2xl ${grouped ? "rounded-br-sm rounded-tr-sm" : "rounded-br-md"}`
                : `bg-muted/80 border border-border/40 shadow-[0_2px_10px_rgba(0,0,0,0.06)] text-foreground rounded-r-2xl rounded-tl-2xl ${grouped ? "rounded-bl-sm rounded-tl-sm" : "rounded-bl-md"}`
            }`}>
              {msg.replyToBody && (
                <ReplyPreview
                  senderName={msg.replyToSender || "Unknown"}
                  body={msg.replyToBody}
                />
              )}
              {structured ? (
                <>
                  <StructuredMessageCard body={msg.body} onLinkClick={!isAgent ? () => onSeen(msg.id, "clicked") : undefined} />
                  <p className={`text-[10px] mt-2 opacity-50 flex items-center gap-1 ${isAgent ? "justify-end" : "justify-start"}`}>
                    {time}{readReceipt}
                  </p>
                </>
              ) : (
                <>
                  {(!linkUrl || !ogLoaded) && (
                    <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      {highlightText(msg.body, search)}
                    </p>
                  )}
                  {linkUrl && <LinkPreview url={linkUrl} isSender={isAgent} onLoaded={setOgLoaded} onLinkClick={!isAgent ? () => onSeen(msg.id, "clicked") : undefined} />}
                  {linkUrl && ogLoaded && bodyWithoutUrl && (
                    <p className="text-sm mt-1.5" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      {highlightText(bodyWithoutUrl, search)}
                    </p>
                  )}
                  <p className={`text-[10px] mt-1 opacity-50 flex items-center gap-1 ${isAgent ? "justify-end" : "justify-start"}`}>
                    {time}
                    {readReceipt}
                  </p>
                </>
              )}
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
  const [showPicker, setShowPicker] = useState(false);
  const [specialPicker, setSpecialPicker] = useState<SpecialPickType | null>(null);
  const [recording, setRecording] = useState(false);
  const [visitorTyping, setVisitorTyping] = useState(false);
  const [visitorRecording, setVisitorRecording] = useState(false);
  const [status, setStatus] = useState(conversation.status);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assignedTo, setAssignedTo] = useState(conversation.assignedTo);
  const [admins, setAdmins] = useState<{ id: string; name: string }[]>([]);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [unreadWhileScrolled, setUnreadWhileScrolled] = useState(0);
  const [visitorOnline, setVisitorOnline] = useState(() => computeVisitorOnline(conversation.metadata));
  const channelRef = useRef<Channel | null>(null);
  const visitorOfflineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  // Visitor presence is handled via Pusher visitor-presence events (bound in the conversation channel below)
  // Clean up the offline timer on unmount
  useEffect(() => {
    return () => { if (visitorOfflineTimerRef.current) clearTimeout(visitorOfflineTimerRef.current); };
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

  const scrollToBottom = (smooth = true) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (smooth) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else {
      el.scrollTop = el.scrollHeight;
    }
    setShowScrollBtn(false);
    isScrolledUpRef.current = false;
    setUnreadWhileScrolled(0);
  };

  useEffect(() => {
    if (!isScrolledUpRef.current) {
      const el = scrollContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }
  }, [messages, visitorTyping, visitorRecording]);

  // Mark visitor messages as read whenever messages change while admin is viewing
  useEffect(() => {
    const hasUnread = messages.some((m) => m.senderType === "visitor" && !m.read);
    if (!hasUnread) return;
    fetch(`/api/admin/conversations/${conversation.id}/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});
  }, [messages, conversation.id]);

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
      if (message.senderType === "visitor") { setVisitorTyping(false); setVisitorRecording(false); }
      setMessages((prev) => {
        if (prev.find((m) => m.id === message.id)) return prev;
        // Reconcile optimistic message from admin
        const optimisticIdx = prev.findIndex(
          (m) => m.id.startsWith("opt-") && m.body === message.body && m.senderType === message.senderType
        );
        if (optimisticIdx !== -1) {
          const updated = [...prev];
          updated[optimisticIdx] = { ...message, status: "sent" };
          return updated;
        }
        if (isScrolledUpRef.current && message.senderType === "visitor") {
          setUnreadWhileScrolled((n) => n + 1);
        }
        return [...prev, message];
      });
    });

    channel.bind("visitor-typing", ({ typing }: { typing: boolean }) => {
      setVisitorTyping(typing);
    });

    channel.bind("visitor-recording", ({ recording }: { recording: boolean }) => {
      setVisitorRecording(recording);
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

    channel.bind("message-deleted", ({ messageId }: { messageId: string }) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    });

    channel.bind("visitor-presence", ({ online }: { online: boolean }) => {
      if (!online) {
        setVisitorOnline(false);
        if (visitorOfflineTimerRef.current) clearTimeout(visitorOfflineTimerRef.current);
        return;
      }
      setVisitorOnline(true);
      if (visitorOfflineTimerRef.current) clearTimeout(visitorOfflineTimerRef.current);
      // Fallback: mark offline if no event arrives within 150s
      visitorOfflineTimerRef.current = setTimeout(() => setVisitorOnline(false), 150_000);
    });

    // Claim conversation and mark read
    fetch(`/api/admin/conversations/${conversation.id}/claim`, { method: "POST" }).catch(() => {});
    fetch(`/api/admin/conversations/${conversation.id}/read`, { method: "POST" }).catch(() => {});

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (visitorOfflineTimerRef.current) clearTimeout(visitorOfflineTimerRef.current);
      channel.unbind_all();
      pusher?.unsubscribe(`private-conversation-${conversation.id}`);
    };
  }, [conversation.id]);

  const sendText = async (body: string) => {
    await fetch(`/api/admin/conversations/${conversation.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
  };

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

  async function uploadAndSendFile(file: File) {
    const localUrl = URL.createObjectURL(file);
    const optId = `opt-${Date.now()}`;
    const optimistic: Message = {
      id: optId,
      senderType: "agent",
      senderName: null,
      body: file.name,
      fileUrl: localUrl,
      fileType: file.type,
      read: true,
      createdAt: new Date().toISOString(),
      status: "uploading",
      uploadProgress: 0,
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const remoteUrl = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/chat-upload");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setMessages((prev) => prev.map((m) => m.id === optId ? { ...m, uploadProgress: pct } : m));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            resolve(data.url);
          } else reject(new Error("Upload failed"));
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        const fd = new FormData();
        fd.append("file", file);
        xhr.send(fd);
      });

      setMessages((prev) => prev.map((m) => m.id === optId ? { ...m, fileUrl: remoteUrl, status: "sending", uploadProgress: undefined } : m));
      URL.revokeObjectURL(localUrl);

      const res = await fetch(`/api/admin/conversations/${conversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: file.name, fileUrl: remoteUrl }),
      });
      if (!res.ok) {
        setMessages((prev) => prev.map((m) => m.id === optId ? { ...m, status: "failed" } : m));
      }
    } catch {
      URL.revokeObjectURL(localUrl);
      setMessages((prev) => prev.map((m) => m.id === optId ? { ...m, status: "failed", uploadProgress: undefined } : m));
      toast.error("Upload failed");
    }
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
            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ${visitorOnline ? PRESENCE.online : PRESENCE.offline}`} />
          </div>

          <div className="flex-1 min-w-0">
            {searchOpen ? (
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages…"
                className="w-full text-sm bg-muted border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary"
              />
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
            {/* When search open: show close X. Otherwise show search + other icons */}
            {searchOpen ? (
              <button onClick={() => { setSearch(""); setSearchOpen(false); }}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => setSearchOpen(true)} title="Search messages"
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* These icons hide when search is open */}
            {!searchOpen && (
              <>
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
              </>
            )}

            {/* Info icon always visible */}
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
                onSeen={(msgId, type) => {
                  fetch(`/api/admin/conversations/${conversation.id}/messages/${msgId}/seen`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type }),
                  }).catch(() => {});
                }}
                search={search}
                isFirstUnread={item.isFirstUnread}
              />
            );
          })}

          {visitorRecording && !visitorTyping && <RecordingIndicator />}
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

        {/* Real-time link preview */}
        {(() => {
          const m = input.match(/(?:https?:\/\/[^\s]+|(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:com|org|net|io|dev|co|ai|app|me|info|biz|xyz|tech|site|online|store|shop)(?:\/[^\s]*)?)/i);
          const liveUrl = m ? (m[0].match(/^https?:\/\//) ? m[0] : `https://${m[0]}`) : null;
          return liveUrl ? (
            <div className="px-3 pt-2 border-t border-border/40">
              <LinkPreview url={liveUrl} isSender={true} />
            </div>
          ) : null;
        })()}

        {/* Input */}
        {status === "open" ? (
          <div className="border-t border-border px-3 py-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
            <div className="flex items-center gap-2">
              {recording ? (
                <div className="w-11 h-11 flex items-center justify-center shrink-0 bg-muted/50 border border-border rounded-full text-muted-foreground">
                  <Paperclip className="w-4 h-4" />
                </div>
              ) : (
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
                  <div className="relative shrink-0">
                    {showPicker && (
                      <MediaPickerPopup
                        variant="admin"
                        onPick={(file) => { uploadAndSendFile(file); setShowPicker(false); }}
                        onSpecialPick={(type) => { setSpecialPicker(type); setShowPicker(false); }}
                        onClose={() => setShowPicker(false)}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPicker((v) => !v)}
                      className={`transition-colors p-1 ${showPicker ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                      title="Attach"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              {!recording && input.trim() ? (
                <button
                  onClick={sendMessage}
                  className="w-11 h-11 bg-primary text-primary-foreground rounded-full flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </button>
              ) : (
                <VoiceNoteButton
                  uploadEndpoint="/api/admin/chat-upload"
                  onSend={(file) => uploadAndSendFile(file)}
                  onStageChange={(active) => {
                    setRecording(active);
                    fetch(`/api/admin/conversations/${conversation.id}/recording`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ recording: active }),
                    }).catch(() => {});
                  }}
                />
              )}
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

      {/* Special pickers */}
      {specialPicker === "catalog" && (
        <CatalogPicker onSend={sendText} onClose={() => setSpecialPicker(null)} />
      )}
      {specialPicker === "contact" && (
        <ContactPicker onSend={sendText} onClose={() => setSpecialPicker(null)} />
      )}
      {specialPicker === "event" && (
        <EventPicker onSend={sendText} onClose={() => setSpecialPicker(null)} />
      )}
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
