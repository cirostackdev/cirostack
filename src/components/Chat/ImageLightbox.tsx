"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt?: string;
  type?: "image" | "video";
  onClose: () => void;
}

export function ImageLightbox({ src, alt, type = "image", onClose }: ImageLightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
      {type === "video" ? (
        <video
          src={src}
          controls
          autoPlay
          className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <img
          src={src}
          alt={alt || "attachment"}
          className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}
