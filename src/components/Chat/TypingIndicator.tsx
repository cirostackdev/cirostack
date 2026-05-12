"use client";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <span className="text-xs text-muted-foreground mr-1">Agent is typing</span>
      <span
        className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}
