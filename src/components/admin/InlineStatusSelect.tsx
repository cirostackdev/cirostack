"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  id: string;
  value: string;
  options: string[];
  colorMap: Record<string, string>;
  onChange: (id: string, newStatus: string) => void;
  saving?: boolean;
  size?: "sm" | "md";
}

export function InlineStatusSelect({ id, value, options, colorMap, onChange, saving, size = "sm" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const badgeCls = "text-xs px-2 py-0.5 rounded-full font-medium w-[76px] text-center";

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => !saving && setOpen((v) => !v)}
        disabled={saving}
        title="Click to change status"
        className={`${badgeCls} cursor-pointer hover:opacity-75 transition-opacity disabled:opacity-40 ${
          colorMap[value] ?? "bg-muted text-muted-foreground"
        }`}
      >
        {value}
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 z-50 bg-popover border border-border rounded-xl shadow-lg py-1 min-w-[130px]">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(id, opt); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs capitalize hover:bg-muted transition-colors flex items-center gap-2.5 ${
                opt === value ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <span
                className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                  (colorMap[opt] ?? "").split(" ").find((c) => c.startsWith("bg-")) ?? "bg-muted"
                }`}
              />
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
