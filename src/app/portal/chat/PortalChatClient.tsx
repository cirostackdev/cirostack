"use client";

import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { Send, MessageSquare, Plus, ChevronLeft, Clipboard, Reply, Check, CheckCheck, Clock, X, ChevronDown, Paperclip, Mic, Play, Link } from "lucide-react";
import { PortalHeaderActionsContext } from "@/components/portal/PortalShell";
import { format, formatDistanceToNow, isSameDay } from "date-fns";
import { TypingIndicator } from "@/components/Chat/TypingIndicator";
import { RecordingIndicator } from "@/components/Chat/RecordingIndicator";
import { DateSeparator } from "@/components/Chat/DateSeparator";
import { ReplyPreview } from "@/components/Chat/ReplyPreview";
import { MediaBubble } from "@/components/Chat/MediaBubble";
import { LinkPreview } from "@/components/Chat/LinkPreview";
import { MediaPickerPopup } from "@/components/Chat/MediaPickerPopup";
import { VoiceNoteButton } from "@/components/Chat/VoiceNoteButton";
import { isStructuredMessage, StructuredMessageCard } from "@/components/Chat/StructuredMessageCard";
import { useSwipeToReply } from "@/components/Chat/useSwipeToReply";
import { CONVERSATION_STATUS_COLORS, PRESENCE } from "@/lib/colors";
import { getPusher } from "@/lib/pusher-client";
import type { Channel } from "pusher-js";

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
  status?: "sending" | "sent" | "failed" | "uploading";
  uploadProgress?: number;
  fileType?: string;
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
  onSeen,
}: {
  msg: Message;
  prevMsg: Message | null;
  convId: string | null;
  clientName: string;
  onReply?: (m: Message) => void;
  onSeen?: (msgId: string, type: "listened" | "watched" | "clicked") => void;
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

  const hasMedia = !!msg.fileUrl;
  const structured = !hasMedia && isStructuredMessage(msg.body);
  const linkMatch = !hasMedia && !structured ? msg.body.match(/(?:https?:\/\/[^\s]+|(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:com|org|net|io|dev|co|ai|app|me|info|biz|xyz|tech|site|online|store|shop)(?:\/[^\s]*)?)/i) : null;
  const linkUrl = linkMatch ? (linkMatch[0].match(/^https?:\/\//) ? linkMatch[0] : `https://${linkMatch[0]}`) : null;
  const [ogLoaded, setOgLoaded] = useState(false);
  const bodyWithoutUrl = linkMatch ? msg.body.replace(linkMatch[0], "").trim() : msg.body;

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

  const rxn = (msg.reactions ?? {}) as Record<string, unknown>;
  const isAudioMsg = !!msg.fileUrl && (
    msg.fileType?.startsWith("audio/") || msg.body?.startsWith("voice-note-") ||
    /\.(mp3|mp4a|wav|aac|m4a|webm|ogg)(\?|$)/i.test(msg.fileUrl) || msg.fileUrl.includes("audio/")
  );
  const isVideoMsg = !isAudioMsg && !!msg.fileUrl && (
    msg.fileType?.startsWith("video/") ||
    /\.(mp4|webm|ogg|mov)(\?|$)/i.test(msg.fileUrl) || msg.fileUrl.includes("video/")
  );
  const hasLink = !!linkUrl;

  const statusIcon = !isAgent ? (
    msg.status === "sending" || msg.status === "uploading"
      ? <Clock className="w-3 h-3 opacity-50 inline" />
      : msg.status === "failed"
      ? <X className="w-3 h-3 text-red-400 inline" />
      : isAudioMsg
      ? rxn._listened
        ? <span className="inline-flex items-center"><Mic className="w-3 h-3 text-blue-400" /><Mic className="w-3 h-3 text-blue-400 -ml-1" /></span>
        : <Mic className="w-3 h-3 opacity-50" />
      : isVideoMsg
      ? rxn._watched
        ? <span className="inline-flex items-center"><Play className="w-3 h-3 text-blue-400 fill-current" /><Play className="w-3 h-3 text-blue-400 fill-current -ml-1" /></span>
        : <Play className="w-3 h-3 opacity-50 fill-current" />
      : hasLink
      ? rxn._clicked
        ? <Link className="w-3 h-3 text-blue-400" />
        : <Link className="w-3 h-3 opacity-50" />
      : msg.read
      ? <CheckCheck className="w-3 h-3 text-blue-400 inline" />
      : <Check className="w-3 h-3 opacity-50 inline" />
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

          {hasMedia ? (
            <div>
              <MediaBubble
                fileUrl={msg.fileUrl!}
                fileName={msg.body}
                isSender={!isAgent}
                fileType={msg.fileType}
                uploadProgress={msg.uploadProgress}
                onListen={isAgent ? () => onSeen?.(msg.id, "listened") : undefined}
                onWatch={isAgent ? () => onSeen?.(msg.id, "watched") : undefined}
              />
              <p className={`text-[10px] mt-1 opacity-50 flex items-center gap-1 ${isAgent ? "justify-start" : "justify-end"}`}>
                {time}{statusIcon}
              </p>
            </div>
          ) : (
            <div className={`${structured ? "p-3" : "px-4 py-2.5"} text-sm leading-relaxed ${
              isAgent
                ? `bg-muted/80 border border-border/40 shadow-[0_2px_10px_rgba(0,0,0,0.06)] text-foreground rounded-r-2xl rounded-tl-2xl ${grouped ? "rounded-bl-sm rounded-tl-sm" : "rounded-bl-md"}`
                : `bg-green-500/10 text-foreground rounded-l-2xl rounded-tr-2xl ${grouped ? "rounded-br-sm rounded-tr-sm" : "rounded-br-md"}`
            }`}>
              {msg.replyToBody && (
                <ReplyPreview senderName={msg.replyToSender || "Unknown"} body={msg.replyToBody} />
              )}
              {structured ? (
                <>
                  <StructuredMessageCard body={msg.body} />
                  <p className={`text-[10px] mt-2 opacity-50 flex items-center gap-1 ${isAgent ? "justify-start" : "justify-end"}`}>
                    {time}{statusIcon}
                  </p>
                </>
              ) : (
                <>
                  {(!linkUrl || !ogLoaded) && (
                    <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.body}</p>
                  )}
                  {linkUrl && <LinkPreview url={linkUrl} isSender={!isAgent} onLoaded={setOgLoaded} onLinkClick={isAgent ? () => onSeen?.(msg.id, "clicked") : undefined} />}
                  {linkUrl && ogLoaded && bodyWithoutUrl && (
                    <p className="text-sm mt-1.5" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{bodyWithoutUrl}</p>
                  )}
                  <p className={`text-[10px] mt-1 opacity-50 flex items-center gap-1 ${isAgent ? "justify-start" : "justify-end"}`}>
                    {time}
                    {statusIcon}
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

export function PortalChatClient({ clientId, clientName, clientEmail, initialConversation }: Props) {
  const setHeaderActions = useContext(PortalHeaderActionsContext);
  const [conversation, setConversation] = useState<Conversation | null>(initialConversation);
  const [messages, setMessages] = useState<Message[]>(initialConversation?.messages ?? []);
  const [agentOnline, setAgentOnline] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [recording, setRecording] = useState(false);
  const [view, setView] = useState<"chat" | "history">("chat");
  const [history, setHistory] = useState<Conversation[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [unreadWhileScrolled, setUnreadWhileScrolled] = useState(0);
  const [agentTyping, setAgentTyping] = useState(false);
  const [agentRecording, setAgentRecording] = useState(false);
  const agentStatusChannelRef = useRef<Channel | null>(null);
  const agentOfflineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef<string | null>(initialConversation?.id ?? null);
  const lastMessageIdRef = useRef<string | null>(
    initialConversation?.messages.at(-1)?.id ?? null
  );
  const isScrolledUpRef = useRef(false);
  const channelRef = useRef<Channel | null>(null);

  // Agent online status — initial REST check + Pusher realtime heartbeat
  useEffect(() => {
    fetch("/api/chat/status")
      .then((r) => r.json())
      .then((d) => setAgentOnline(d.online))
      .catch(() => setAgentOnline(false));

    const pusherClient = getPusher();
    if (!pusherClient) return;

    const ch = pusherClient.subscribe("private-agent-status");
    agentStatusChannelRef.current = ch;

    const resetOfflineTimer = () => {
      if (agentOfflineTimerRef.current) clearTimeout(agentOfflineTimerRef.current);
      agentOfflineTimerRef.current = setTimeout(() => setAgentOnline(false), 150_000);
    };

    ch.bind("agent-online", () => { setAgentOnline(true); resetOfflineTimer(); });
    ch.bind("agent-heartbeat", () => { setAgentOnline(true); resetOfflineTimer(); });
    ch.bind("agent-offline", () => {
      setAgentOnline(false);
      if (agentOfflineTimerRef.current) clearTimeout(agentOfflineTimerRef.current);
    });

    return () => {
      if (agentOfflineTimerRef.current) clearTimeout(agentOfflineTimerRef.current);
      ch.unbind_all();
      pusherClient.unsubscribe("private-agent-status");
    };
  }, []);

  // Mark agent messages as read
  useEffect(() => {
    const cid = conversationIdRef.current;
    if (!cid) return;
    fetch(`/api/chat/conversations/${cid}/read`, { method: "POST" }).catch(() => {});
  }, [messages]);

  // Subscribe to a conversation's Pusher channel
  const subscribeToPusher = useCallback((convId: string) => {
    const pusherClient = getPusher();
    if (!pusherClient) return;

    // Unsubscribe from previous channel if any
    if (channelRef.current) {
      channelRef.current.unbind_all();
      pusherClient.unsubscribe(channelRef.current.name);
    }

    const ch = pusherClient.subscribe(`private-conversation-${convId}`);
    channelRef.current = ch;

    ch.bind("new-message", ({ message }: { message: Message }) => {
      setAgentTyping(false);
      setAgentRecording(false);
      setMessages((prev) => {
        if (prev.find((m) => m.id === message.id)) return prev;
        // Reconcile optimistic message
        const optIdx = prev.findIndex(
          (m) => m.id.startsWith("opt-") && m.body === message.body && m.senderType === message.senderType
        );
        if (optIdx !== -1) {
          const updated = [...prev];
          updated[optIdx] = { ...message, status: "sent" };
          return updated;
        }
        if (isScrolledUpRef.current && message.senderType === "agent") {
          setUnreadWhileScrolled((n) => n + 1);
        }
        return [...prev, message];
      });
      if (message.id) lastMessageIdRef.current = message.id;
    });

    ch.bind("agent-typing", ({ typing }: { typing: boolean }) => {
      setAgentTyping(typing);
    });

    ch.bind("agent-recording", ({ recording }: { recording: boolean }) => {
      setAgentRecording(recording);
    });

    ch.bind("reaction-update", ({ messageId, reactions }: { messageId: string; reactions: Record<string, string[]> }) => {
      setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, reactions } : m));
    });

    ch.bind("messages-read", ({ by }: { by: string }) => {
      if (by === "admin") {
        setMessages((prev) => prev.map((m) => m.senderType === "visitor" ? { ...m, read: true } : m));
      }
    });

    ch.bind("message-deleted", ({ messageId }: { messageId: string }) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    });

    ch.bind("conversation-closed", () => {
      setConversation((prev) => prev ? { ...prev, status: "closed" } : prev);
    });
  }, []);

  // Cleanup Pusher on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
        getPusher()?.unsubscribe(channelRef.current.name);
      }
    };
  }, []);

  // Subscribe when conversation id is known / changes
  useEffect(() => {
    if (conversationIdRef.current) {
      subscribeToPusher(conversationIdRef.current);
    }
  }, [subscribeToPusher]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isUp = el.scrollTop + el.clientHeight < el.scrollHeight - 100;
    setShowScrollBtn(isUp);
    isScrolledUpRef.current = isUp;
    if (!isUp) setUnreadWhileScrolled(0);
  };

  const scrollToBottom = () => {
    const el = scrollContainerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    setShowScrollBtn(false);
    isScrolledUpRef.current = false;
    setUnreadWhileScrolled(0);
  };

  useEffect(() => {
    if (!isScrolledUpRef.current) {
      const el = scrollContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }
  }, [messages, agentTyping, agentRecording]);

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
        const isNewConv = !conversationIdRef.current || conversationIdRef.current !== cid;
        conversationIdRef.current = cid;
        lastMessageIdRef.current = message.id;
        setMessages((prev) => prev.map((m) => m.id === optimistic.id ? { ...message, status: "sent" } : m));
        // Subscribe to Pusher if this created a new conversation
        if (isNewConv) subscribeToPusher(cid);
      } else {
        setMessages((prev) => prev.map((m) => m.id === optimistic.id ? { ...m, status: "failed" } : m));
      }
    } catch {
      setMessages((prev) => prev.map((m) => m.id === optimistic.id ? { ...m, status: "failed" } : m));
    }

    setSending(false);
    inputRef.current?.focus();
  };


  const uploadAndSendFile = async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    const optId = `opt-${Date.now()}`;
    const optimistic: Message = {
      id: optId,
      conversationId: conversationIdRef.current || "",
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
      const remoteUrl = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/portal/chat/upload");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setMessages((prev) => prev.map((m) => m.id === optId ? { ...m, uploadProgress: pct } : m));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText).url);
          } else reject(new Error("Upload failed"));
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        const fd = new FormData();
        fd.append("file", file);
        xhr.send(fd);
      });

      setMessages((prev) => prev.map((m) => m.id === optId ? { ...m, fileUrl: remoteUrl, status: "sending", uploadProgress: undefined } : m));
      URL.revokeObjectURL(localUrl);

      const res = await fetch("/api/portal/chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: file.name, fileUrl: remoteUrl, conversationId: conversationIdRef.current }),
      });
      if (res.ok) {
        const { message, conversationId: cid } = await res.json();
        const isNewConv = !conversationIdRef.current || conversationIdRef.current !== cid;
        if (cid) conversationIdRef.current = cid;
        setMessages((prev) => prev.map((m) => m.id === optId ? { ...message, status: "sent" } : m));
        if (isNewConv && cid) subscribeToPusher(cid);
      } else {
        setMessages((prev) => prev.map((m) => m.id === optId ? { ...m, status: "failed" } : m));
      }
    } catch {
      URL.revokeObjectURL(localUrl);
      setMessages((prev) => prev.map((m) => m.id === optId ? { ...m, status: "failed", uploadProgress: undefined } : m));
    }
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

  // Inject active status + history button into PortalShell header
  useEffect(() => {
    setHeaderActions(
      <>
        {conversation && !isClosed && (
          <span className="inline-block text-xs px-2.5 py-0.5 rounded-full font-semibold bg-green-500/15 text-green-500">
            active
          </span>
        )}
        {(isClosed || !conversation) && (
          <button
            onClick={startNewConversation}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3 h-3" /> New chat
          </button>
        )}
        <button
          onClick={view === "history" ? () => setView("chat") : loadHistory}
          className="text-xs font-medium px-2.5 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          {view === "history" ? "← Back" : "History"}
        </button>
      </>
    );
    return () => setHeaderActions(null);
  }, [conversation, isClosed, view, setHeaderActions]);

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
              onClick={() => { setConversation(c); setMessages(c.messages); conversationIdRef.current = c.id; lastMessageIdRef.current = c.messages.at(-1)?.id ?? null; setView("chat"); subscribeToPusher(c.id); }}
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
              onSeen={(msgId, type) => {
                if (!conversationIdRef.current) return;
                fetch(`/api/chat/conversations/${conversationIdRef.current}/messages/${msgId}/seen`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ type }),
                }).catch(() => {});
              }}
            />
          );
        })}

        {agentRecording && !agentTyping && <RecordingIndicator />}
        {agentTyping && <TypingIndicator />}

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
      {!isClosed ? (
        <div className="border-t border-border px-3 py-3 pb-[max(12px,env(safe-area-inset-bottom))] shrink-0">
          <div className="flex items-center gap-2">
            {recording ? (
              <div className="w-11 h-11 flex items-center justify-center shrink-0 bg-muted/50 border border-border rounded-full text-muted-foreground">
                <Paperclip className="w-4 h-4" />
              </div>
            ) : (
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
                <div className="relative shrink-0">
                  {showPicker && (
                    <MediaPickerPopup
                      variant="portal"
                      onPick={(file) => { setShowPicker(false); uploadAndSendFile(file); }}
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
                type="button"
                onClick={sendMessage}
                disabled={sending}
                className="w-11 h-11 bg-primary text-primary-foreground rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <VoiceNoteButton
                uploadEndpoint="/api/portal/chat/upload"
                onSend={(file) => uploadAndSendFile(file)}
                onStageChange={(active) => {
                  setRecording(active);
                  if (conversationIdRef.current) {
                    fetch(`/api/chat/conversations/${conversationIdRef.current}/recording`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ recording: active }),
                    }).catch(() => {});
                  }
                }}
              />
            )}
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
