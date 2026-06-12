"use client";

import { useState } from "react";
import type { ChatMessage as Msg } from "./useChat";
import { format } from "date-fns";
import { Clipboard, Reply, Check, CheckCheck, Clock, X } from "lucide-react";
import { ReplyPreview } from "./ReplyPreview";
import { MediaBubble } from "./MediaBubble";
import { LinkPreview } from "./LinkPreview";
import { useSwipeToReply } from "./useSwipeToReply";
import { isStructuredMessage, StructuredMessageCard } from "./StructuredMessageCard";

const REACTION_EMOJIS = ["👍", "❤️", "😊", "🙏", "✅"];

interface ChatMessageProps {
  message: Msg;
  prevMessage?: Msg | null;
  conversationId?: string | null;
  onReply?: (msg: Msg) => void;
  onSeen?: (msgId: string, type: "listened" | "watched" | "clicked") => void;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isGroupedWith(msg: Msg, prev: Msg | null | undefined): boolean {
  if (!prev) return false;
  if (msg.senderType !== prev.senderType) return false;
  const diff = new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime();
  return diff < 2 * 60 * 1000;
}

export function ChatMessage({ message, prevMessage, conversationId, onReply, onSeen }: ChatMessageProps) {
  const isVisitor = message.senderType === "visitor";
  const isSystem = message.senderType === "system";
  const time = format(new Date(message.createdAt), "HH:mm");
  const grouped = isGroupedWith(message, prevMessage);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const { bubbleRef, iconRef, onTouchStart, onTouchMove, onTouchEnd } = useSwipeToReply(
    () => onReply?.(message)
  );

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <span className="text-[11px] text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/40">
          {message.body}
        </span>
      </div>
    );
  }

  const hasMedia = !!message.fileUrl;
  const structured = !hasMedia && isStructuredMessage(message.body);

  // Extract first URL from message body for link preview (supports bare domains)
  const urlMatch = !hasMedia && !structured ? message.body.match(/(?:https?:\/\/[^\s]+|(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:com|org|net|io|dev|co|ai|app|me|info|biz|xyz|tech|site|online|store|shop)(?:\/[^\s]*)?)/i) : null;
  const linkUrl = urlMatch ? (urlMatch[0].match(/^https?:\/\//) ? urlMatch[0] : `https://${urlMatch[0]}`) : null;
  const [ogLoaded, setOgLoaded] = useState(false);

  // Text with URL removed (shown below preview when OG loads)
  const bodyWithoutUrl = linkUrl ? message.body.replace(urlMatch![0], "").trim() : message.body;

  const reactions = message.reactions as Record<string, string[]> | null | undefined;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.body).catch(() => {});
    setShowMenu(false);
  };

  const handleReact = async (emoji: string) => {
    if (!conversationId) return;
    try {
      await fetch(`/api/chat/conversations/${conversationId}/messages/${message.id}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });
    } catch {}
    setShowMenu(false);
  };

  const rxn = (message.reactions ?? {}) as Record<string, unknown>;
  const isAudioMsg = !!message.fileUrl && (
    message.fileType?.startsWith("audio/") ||
    message.body?.startsWith("voice-note-") ||
    /\.(mp3|mp4a|wav|aac|m4a|webm|ogg)(\?|$)/i.test(message.fileUrl) ||
    message.fileUrl.includes("audio/")
  );
  const isVideoMsg = !isAudioMsg && !!message.fileUrl && (
    message.fileType?.startsWith("video/") ||
    /\.(mp4|webm|ogg|mov)(\?|$)/i.test(message.fileUrl) ||
    message.fileUrl.includes("video/")
  );
  const hasLink = !!linkUrl || structured;

  const listened = !!rxn._listened;
  const watched  = !!rxn._watched;
  const clicked  = !!rxn._clicked;

  // Double blue tick meaning varies by type: read (text), listened (audio), watched (video), clicked (link/structured)
  const interacted = isAudioMsg ? listened : isVideoMsg ? watched : hasLink ? clicked : message.read;

  const statusIcon = isVisitor ? (
    message.status === "sending" || message.status === "uploading"
      ? <Clock className="w-3 h-3 opacity-50 inline" />
      : message.status === "failed"
      ? <X className="w-3 h-3 text-red-400 inline" />
      : interacted
      ? <CheckCheck className="w-3 h-3 text-blue-400 inline" />
      : <Check className="w-3 h-3 opacity-50 inline" />
  ) : null;

  const reactionDisplay = reactions && Object.keys(reactions).length > 0 ? (
    <div className={`flex flex-wrap gap-1 mt-1 ${isVisitor ? "justify-end" : "justify-start"}`}>
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
      {lightboxSrc && (
        <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}

      <div
        className={`flex ${isVisitor ? "justify-end" : "justify-start"} ${grouped ? "mb-0.5" : "mb-3"} group relative`}
        onMouseLeave={() => setShowMenu(false)}
      >
        {/* Swipe-to-reply icon (revealed on left as bubble moves right) */}
        <div
          ref={iconRef}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 opacity-0 text-muted-foreground pointer-events-none"
          style={{ transform: "scale(0.6)" }}
        >
          <Reply className="w-5 h-5" />
        </div>

        <div
          ref={bubbleRef}
          className={`max-w-[75%] flex flex-col ${isVisitor ? "items-end" : "items-start"}`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {!grouped && !isVisitor && message.senderName && (
            <p className="text-[11px] font-semibold text-muted-foreground mb-1 px-1">
              {message.senderName}
            </p>
          )}

          {/* Context menu */}
          <div
            className={`absolute ${isVisitor ? "right-0" : "left-0"} -top-8 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center gap-0.5 bg-background border border-border rounded-lg shadow-md px-1 py-0.5`}
          >
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
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
              title="Copy"
            >
              <Clipboard className="w-3.5 h-3.5" />
            </button>
            {onReply && (
              <button
                onClick={() => { onReply(message); setShowMenu(false); }}
                className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
                title="Reply"
              >
                <Reply className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {hasMedia ? (
            <div>
              <MediaBubble
                fileUrl={message.fileUrl!}
                fileName={message.body}
                fileType={message.fileType}
                isSender={isVisitor}
                uploadProgress={message.uploadProgress}
                onListen={!isVisitor ? () => onSeen?.(message.id, "listened") : undefined}
                onWatch={!isVisitor ? () => onSeen?.(message.id, "watched") : undefined}
              />
              <p className={`text-[10px] mt-1 opacity-50 flex items-center gap-1 ${isVisitor ? "justify-end" : "justify-start"}`}>
                {time}{statusIcon}
              </p>
            </div>
          ) : (
            <div
              className={`${structured ? "p-3" : "px-4 py-2.5"} text-sm leading-relaxed ${
                isVisitor
                  ? `bg-green-500/10 text-foreground rounded-l-2xl rounded-tr-2xl ${grouped ? "rounded-br-sm rounded-tr-sm" : "rounded-br-md"}`
                  : `bg-muted/80 border border-border/40 shadow-[0_2px_10px_rgba(0,0,0,0.06)] text-foreground rounded-r-2xl rounded-tl-2xl ${grouped ? "rounded-bl-sm rounded-tl-sm" : "rounded-bl-md"}`
              }`}
            >
              {message.replyToBody && (
                <ReplyPreview
                  senderName={message.replyToSender || "Unknown"}
                  body={message.replyToBody}
                />
              )}
              {structured ? (
                <>
                  <StructuredMessageCard body={message.body} onLinkClick={!isVisitor ? () => onSeen?.(message.id, "clicked") : undefined} />
                  <p className={`text-[10px] mt-2 opacity-60 flex items-center gap-1 ${isVisitor ? "justify-end" : "justify-start"}`}>
                    {time}{statusIcon}
                  </p>
                </>
              ) : (
                <>
                  {(!linkUrl || !ogLoaded) && (
                    <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{message.body}</p>
                  )}
                  {linkUrl && <LinkPreview url={linkUrl} isSender={isVisitor} onLoaded={setOgLoaded} onLinkClick={!isVisitor ? () => onSeen?.(message.id, "clicked") : undefined} />}
                  {linkUrl && ogLoaded && bodyWithoutUrl && (
                    <p className="text-sm mt-1.5" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{bodyWithoutUrl}</p>
                  )}
                  <p className={`text-[10px] mt-1 opacity-60 flex items-center gap-1 ${isVisitor ? "justify-end" : "justify-start"}`}>
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
