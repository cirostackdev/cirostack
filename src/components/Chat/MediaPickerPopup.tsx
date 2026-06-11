"use client";

import { useEffect, useRef } from "react";
import { FileText, Image, Video, BookOpen, User, Calendar, Music } from "lucide-react";

export type SpecialPickType = "catalog" | "contact" | "event";

interface MediaPickerPopupProps {
  onPick: (file: File) => void;
  onSpecialPick?: (type: SpecialPickType) => void;
  onClose: () => void;
  variant?: "admin" | "visitor" | "portal";
}

const FILE_ITEMS = [
  {
    key: "image",
    label: "Image",
    icon: Image,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    accept: "image/*",
  },
  {
    key: "video",
    label: "Video",
    icon: Video,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    accept: "video/*",
    adminOnly: false,
    noVisitor: true, // hidden in visitor widget
  },
  {
    key: "audio",
    label: "Audio",
    icon: Music,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    accept: "audio/*",
  },
  {
    key: "document",
    label: "Document",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    accept: ".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip",
  },
] as const;

const SPECIAL_ITEMS = [
  { key: "catalog" as SpecialPickType, label: "Catalog", icon: BookOpen, color: "text-amber-500", bg: "bg-amber-500/10" },
  { key: "contact" as SpecialPickType, label: "Contact", icon: User, color: "text-green-500", bg: "bg-green-500/10" },
  { key: "event" as SpecialPickType, label: "Event", icon: Calendar, color: "text-orange-500", bg: "bg-orange-500/10" },
];

export function MediaPickerPopup({ onPick, onSpecialPick, onClose, variant = "visitor" }: MediaPickerPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const triggerPick = (accept: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) onPick(file);
      onClose();
    };
    input.click();
  };

  const visibleFileItems = FILE_ITEMS.filter((item) => {
    if (variant === "visitor" && "noVisitor" in item && item.noVisitor) return false;
    return true;
  });

  return (
    <div
      ref={popupRef}
      className="absolute bottom-full mb-3 right-0 z-50 bg-background border border-border rounded-2xl shadow-xl p-3 animate-in fade-in slide-in-from-bottom-2 duration-150"
      style={{ width: variant === "admin" ? 220 : 172 }}
    >
      <div className="grid grid-cols-3 gap-2">
        {visibleFileItems.map(({ key, label, icon: Icon, color, bg, accept }) => (
          <button
            key={key}
            type="button"
            onClick={() => triggerPick(accept)}
            className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl hover:bg-muted transition-colors"
          >
            <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
          </button>
        ))}

        {variant === "admin" && SPECIAL_ITEMS.map(({ key, label, icon: Icon, color, bg }) => (
          <button
            key={key}
            type="button"
            onClick={() => { onSpecialPick?.(key); onClose(); }}
            className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl hover:bg-muted transition-colors"
          >
            <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
