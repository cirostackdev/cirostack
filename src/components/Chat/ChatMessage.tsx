"use client";

import type { ChatMessage as Msg } from "./useChat";
import { format } from "date-fns";
import { FileText } from "lucide-react";

interface ChatMessageProps {
  message: Msg;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isVisitor = message.senderType === "visitor";
  const isSystem = message.senderType === "system";
  const time = format(new Date(message.createdAt), "HH:mm");

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <span className="text-[11px] text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/40">
          {message.body}
        </span>
      </div>
    );
  }

  const isImage = message.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isFile = message.fileUrl && !isImage;

  return (
    <div className={`flex ${isVisitor ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-[75%] flex flex-col ${isVisitor ? "items-end" : "items-start"}`}>
        {!isVisitor && message.senderName && (
          <p className="text-[11px] font-semibold text-muted-foreground mb-1 px-1">
            {message.senderName}
          </p>
        )}

        {isImage ? (
          <div className={`p-2 rounded-2xl ${isVisitor ? "bg-primary/10 rounded-tr-md" : "bg-muted/60 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-tl-md"}`}>
            <img
              src={message.fileUrl!}
              alt="attachment"
              className="rounded-xl max-w-full max-h-48 object-cover"
            />
            <p className={`text-[10px] mt-1.5 opacity-60 ${isVisitor ? "text-right" : "text-left"}`}>
              {time}
            </p>
          </div>
        ) : isFile ? (
          <div className={`p-3.5 rounded-2xl ${isVisitor ? "bg-primary/10 rounded-tr-md" : "bg-muted/60 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-tl-md"} max-w-[220px] w-full`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-background rounded-xl shadow-sm flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-foreground" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <a
                  href={message.fileUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold truncate block hover:underline"
                >
                  View attachment
                </a>
                <p className="text-[10px] text-muted-foreground mt-0.5">Document</p>
              </div>
            </div>
            <p className={`text-[10px] mt-2 opacity-60 ${isVisitor ? "text-right" : "text-left"}`}>{time}</p>
          </div>
        ) : (
          <div
            className={`px-4 py-2.5 text-sm leading-relaxed ${
              isVisitor
                ? "bg-primary text-primary-foreground rounded-l-2xl rounded-tr-2xl rounded-br-md"
                : "bg-muted/80 border border-border/40 shadow-[0_2px_10px_rgba(0,0,0,0.06)] text-foreground rounded-r-2xl rounded-tl-2xl rounded-bl-md"
            }`}
          >
            <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{message.body}</p>
            <p className={`text-[10px] mt-1 opacity-60 ${isVisitor ? "text-right" : "text-left"}`}>
              {time}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
