"use client";

import { useState } from "react";
import { FileText, Music, Video, File, Play } from "lucide-react";
import { ImageLightbox } from "./ImageLightbox";

interface MediaBubbleProps {
  fileUrl: string;
  fileName?: string;
  isSender: boolean; // true = right-side bubble color, false = received color
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaBubble({ fileUrl, fileName, isSender }: MediaBubbleProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxType, setLightboxType] = useState<"image" | "video">("image");

  const openLightbox = (type: "image" | "video") => {
    setLightboxType(type);
    setLightboxSrc(fileUrl);
  };

  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(fileUrl);
  const isVideo = /\.(mp4|webm|ogg|mov|quicktime)(\?|$)/i.test(fileUrl) ||
    fileUrl.includes("video/");
  const isAudio = /\.(mp3|mp4a|ogg|wav|webm|aac|m4a)(\?|$)/i.test(fileUrl) ||
    fileUrl.includes("audio/");

  const senderBg = "bg-green-500/10";
  const receivedBg = "bg-muted/60 shadow-[0_2px_10px_rgba(0,0,0,0.06)]";
  const bg = isSender ? senderBg : receivedBg;
  const roundSender = "rounded-tr-md";
  const roundReceived = "rounded-tl-md";
  const round = isSender ? roundSender : roundReceived;

  if (isImage) {
    return (
      <>
        {lightboxSrc && <ImageLightbox src={lightboxSrc} type="image" onClose={() => setLightboxSrc(null)} />}
        <div className={`p-2 rounded-2xl ${bg} ${round}`}>
          <img
            src={fileUrl}
            alt={fileName || "attachment"}
            className="rounded-xl max-w-full max-h-52 object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openLightbox("image")}
          />
        </div>
      </>
    );
  }

  if (isVideo) {
    return (
      <>
        {lightboxSrc && <ImageLightbox src={lightboxSrc} type="video" onClose={() => setLightboxSrc(null)} />}
        <div className={`p-2 rounded-2xl ${bg} ${round} max-w-[280px]`}>
          <div className="relative cursor-pointer group" onClick={() => openLightbox("video")}>
            <video
              src={fileUrl}
              preload="metadata"
              className="rounded-xl max-w-full max-h-48 object-contain pointer-events-none"
              style={{ maxWidth: "260px" }}
            />
            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl group-hover:bg-black/30 transition-colors">
              <Play className="w-10 h-10 text-white fill-white drop-shadow-lg" style={{ strokeLinejoin: "round", strokeWidth: 1.5 }} />
            </div>
          </div>
          {fileName && <p className="text-[10px] opacity-50 mt-1 truncate">{fileName}</p>}
        </div>
      </>
    );
  }

  if (isAudio) {
    return (
      <div className={`px-3 py-2.5 rounded-2xl ${bg} ${round} w-[240px]`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Music className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xs font-medium truncate flex-1">{fileName || "Audio"}</p>
        </div>
        <audio src={fileUrl} controls preload="metadata" className="w-full h-8" />
      </div>
    );
  }

  // Generic file
  const ext = fileUrl.split(".").pop()?.toUpperCase() ?? "FILE";
  const IconComp = ext === "MP4" || ext === "WEBM" ? Video :
    ext === "MP3" || ext === "WAV" || ext === "AAC" ? Music : FileText;

  return (
    <div className={`p-3.5 rounded-2xl ${bg} ${round} max-w-[220px] w-full`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-background rounded-xl shadow-sm flex items-center justify-center shrink-0">
          <IconComp className="w-5 h-5 text-foreground" strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold truncate block hover:underline"
          >
            {fileName || "Download file"}
          </a>
          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase">{ext}</p>
        </div>
      </div>
    </div>
  );
}
