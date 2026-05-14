"use client";

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="px-4 py-3 bg-muted/80 border border-border/40 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-r-2xl rounded-tl-2xl rounded-bl-md">
        <div className="flex items-center gap-1">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
