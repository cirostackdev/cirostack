"use client";

import type { ChatMessage as Msg } from "./useChat";
import { format } from "date-fns";

interface ChatMessageProps {
  message: Msg;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isVisitor = message.senderType === "visitor";
  const isSystem = message.senderType === "system";
  const time = format(new Date(message.createdAt), "HH:mm");

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {message.body}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex ${isVisitor ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
          isVisitor
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm"
        }`}
      >
        {!isVisitor && message.senderName && (
          <p className="text-xs font-semibold opacity-70 mb-0.5">{message.senderName}</p>
        )}

        {message.fileUrl ? (
          message.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
            <img
              src={message.fileUrl}
              alt="attachment"
              className="rounded-lg max-w-full max-h-48 object-contain"
            />
          ) : (
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-xs"
            >
              View attachment
            </a>
          )
        ) : null}

        <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{message.body}</p>

        <p
          className={`text-[10px] mt-1 opacity-60 ${
            isVisitor ? "text-right" : "text-left"
          }`}
        >
          {time}
        </p>
      </div>
    </div>
  );
}
