"use client";

import { Mic, FileText, BookOpen, User, Calendar } from "lucide-react";

interface ReplyPreviewProps {
  senderName: string;
  body: string;
  fileUrl?: string | null;
  onClick?: () => void;
}

function ReplyMedia({ body, fileUrl }: { body: string; fileUrl?: string | null }) {
  if (fileUrl) {
    const lower = (fileUrl + body).toLowerCase();

    // Image — show actual thumbnail
    if (/\.(jpg|jpeg|png|gif|webp|svg)/i.test(fileUrl) || fileUrl.includes("image/") || body === "Photo") {
      return (
        <div className="flex items-center gap-1.5 min-w-0">
          <img src={fileUrl} alt="" className="w-9 h-9 rounded object-cover shrink-0" />
          <span className="text-xs opacity-70 truncate">Photo</span>
        </div>
      );
    }

    // Voice note
    if (body.startsWith("voice-note-") || lower.includes("audio/") || /\.(mp3|mp4a|wav|aac|m4a|webm|ogg)/.test(lower)) {
      return (
        <div className="flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5 opacity-60 shrink-0" />
          <span className="text-xs opacity-70">Voice message</span>
        </div>
      );
    }

    // Video — show thumbnail frame if possible, fallback to icon
    if (lower.includes("video/") || /\.(mp4|mov|webm|ogg)/.test(lower)) {
      return (
        <div className="flex items-center gap-1.5">
          <div className="w-9 h-9 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden">
            <video src={`${fileUrl}#t=0.1`} className="w-full h-full object-cover" muted preload="metadata" />
          </div>
          <span className="text-xs opacity-70">Video</span>
        </div>
      );
    }

    // Generic document
    return (
      <div className="flex items-center gap-1.5 min-w-0">
        <FileText className="w-3.5 h-3.5 opacity-60 shrink-0" />
        <span className="text-xs opacity-70 truncate">{body}</span>
      </div>
    );
  }

  // Structured messages
  if (body === "Portfolio Catalog" || body.startsWith("__CATALOG__")) {
    return (
      <div className="flex items-center gap-1.5">
        <BookOpen className="w-3.5 h-3.5 opacity-60 shrink-0" />
        <span className="text-xs opacity-70">Portfolio Catalog</span>
      </div>
    );
  }
  if (body === "Contact Info" || body.startsWith("__CONTACT__")) {
    return (
      <div className="flex items-center gap-1.5">
        <User className="w-3.5 h-3.5 opacity-60 shrink-0" />
        <span className="text-xs opacity-70">Contact Info</span>
      </div>
    );
  }
  if (body === "Events" || body.startsWith("__EVENT__")) {
    return (
      <div className="flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 opacity-60 shrink-0" />
        <span className="text-xs opacity-70">Events</span>
      </div>
    );
  }

  // Plain text
  return <p className="text-xs opacity-70 truncate">{body}</p>;
}

export function ReplyPreview({ senderName, body, fileUrl, onClick }: ReplyPreviewProps) {
  return (
    <div
      className={`border-l-2 border-primary/60 pl-2 mb-1.5 rounded-sm bg-black/5 dark:bg-white/5 px-2 py-1${onClick ? " cursor-pointer active:opacity-70" : ""}`}
      onClick={onClick}
    >
      <p className="text-[10px] font-semibold text-primary mb-0.5">{senderName}</p>
      <ReplyMedia body={body} fileUrl={fileUrl} />
    </div>
  );
}

/** Scroll to a message element and briefly highlight it */
export function scrollToMessage(messageId: string) {
  const el = document.querySelector(`[data-message-id="${messageId}"]`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("reply-highlight");
  setTimeout(() => el.classList.remove("reply-highlight"), 1500);
}
