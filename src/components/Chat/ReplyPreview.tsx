"use client";

interface ReplyPreviewProps {
  senderName: string;
  body: string;
}

export function ReplyPreview({ senderName, body }: ReplyPreviewProps) {
  return (
    <div className="border-l-2 border-primary/60 pl-2 mb-1 opacity-80">
      <p className="text-[10px] font-semibold">{senderName}</p>
      <p className="text-xs truncate">{body}</p>
    </div>
  );
}
