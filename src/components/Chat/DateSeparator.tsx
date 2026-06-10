"use client";

import { isToday, isYesterday, format } from "date-fns";

export function DateSeparator({ date }: { date: Date }) {
  const label = isToday(date)
    ? "Today"
    : isYesterday(date)
    ? "Yesterday"
    : format(date, "MMM d, yyyy");

  return (
    <div className="flex items-center gap-3 my-3">
      <div className="flex-1 h-px bg-border/50" />
      <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
      <div className="flex-1 h-px bg-border/50" />
    </div>
  );
}
