"use client";

export function RecordingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="px-4 py-3 bg-muted/80 border border-border/40 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-r-2xl rounded-tl-2xl rounded-bl-md">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <div className="flex items-end gap-[2px] h-4">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-muted-foreground/50"
                style={{
                  height: "100%",
                  transformOrigin: "bottom",
                  animation: `voiceBar 0.8s ease-in-out ${(i * 0.06).toFixed(2)}s infinite alternate`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
