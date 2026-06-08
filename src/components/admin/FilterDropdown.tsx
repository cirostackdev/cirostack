"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  colorMap?: Record<string, string>;
}

export function FilterDropdown({ label, value, options, onChange, colorMap }: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleOpen = useCallback(() => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
    setOpen((v) => !v);
  }, [open]);

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
        className="h-8 text-xs px-2 bg-muted border border-border rounded-lg flex items-center gap-1.5 hover:bg-muted/80 transition-colors"
      >
        <span className="truncate">{value || label}</span>
        <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
      </button>

      {open && (
        <div
          ref={dropRef}
          className="fixed z-[9999] bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[140px]"
          style={{ top: pos.top, left: pos.left }}
        >
          <button
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-accent/50 transition-colors ${
              value === "" ? "bg-accent text-foreground font-medium" : "text-foreground"
            }`}
          >
            {colorMap && <span className="w-2 h-2 rounded-full bg-muted-foreground/40 shrink-0" />}
            {label}
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-accent/50 transition-colors ${
                value === opt ? "bg-accent text-foreground font-medium" : "text-foreground"
              }`}
            >
              {colorMap && (
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    (colorMap[opt] ?? "").split(" ").find((c) => c.startsWith("bg-")) ?? "bg-muted-foreground/40"
                  }`}
                />
              )}
              {opt}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
