"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  id: string;
  value: string;
  options: string[];
  colorMap: Record<string, string>;
  onChange: (id: string, newStatus: string) => void;
  saving?: boolean;
  size?: "sm" | "md";
}

export function InlineStatusSelect({ id, value, options, colorMap, onChange, saving }: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleOpen = useCallback(() => {
    if (saving) return;
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, left: rect.left });
    }
    setOpen((v) => !v);
  }, [open, saving]);

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (
        btnRef.current?.contains(e.target as Node) ||
        dropRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
    }
    function onScroll() { setOpen(false); }
    document.addEventListener("mousedown", onMouseDown);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleOpen}
        disabled={saving}
        title="Click to change status"
        className={`text-xs px-2 py-0.5 rounded-full font-medium w-[76px] text-center cursor-pointer hover:opacity-75 transition-opacity disabled:opacity-40 ${
          colorMap[value] ?? "bg-muted text-muted-foreground"
        }`}
      >
        {value}
      </button>

      {open && (
        <div
          ref={dropRef}
          className="fixed z-[9999] bg-popover border border-border rounded-xl shadow-lg py-1 min-w-[130px]"
          style={{ top: pos.top, left: pos.left }}
        >
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
    </>
  );
}
