"use client";

import { useState } from "react";
import { FileText, Music, Video, File, Play } from "lucide-react";
import { ImageLightbox } from "./ImageLightbox";

interface MediaBubbleProps {
  fileUrl: string;
  fileName?: string;
  fileType?: string; // MIME type hint for blob URLs
  isSender: boolean; // true = right-side bubble color, false = received color
  uploadProgress?: number; // 0-100, undefined = not uploading
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadOverlay({ progress }: { progress: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
      <svg width="52" height="52" className="rotate-[-90deg]">
        <circle cx="26" cy="26" r={r} fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="3" />
        <circle cx="26" cy="26" r={r} fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} className="transition-[stroke-dashoffset] duration-200" />
      </svg>
      <span className="absolute text-white text-[10px] font-medium">{progress}%</span>
    </div>
  );
}

export function MediaBubble({ fileUrl, fileName, fileType, isSender, uploadProgress }: MediaBubbleProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxType, setLightboxType] = useState<"image" | "video">("image");

  const openLightbox = (type: "image" | "video") => {
    setLightboxType(type);
    setLightboxSrc(fileUrl);
  };

  const isImage = fileType?.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(fileUrl);
  const isAudio = fileType?.startsWith("audio/") ||
    fileName?.startsWith("voice-note-") ||
    /\.(mp3|mp4a|wav|aac|m4a)(\?|$)/i.test(fileUrl) ||
    fileUrl.includes("audio/");
  const isVideo = !isAudio && (
    fileType?.startsWith("video/") ||
    /\.(mp4|webm|ogg|mov|quicktime)(\?|$)/i.test(fileUrl) ||
    fileUrl.includes("video/")
  );

  const senderBg = "bg-green-500/10";
  const receivedBg = "bg-muted/60 shadow-[0_2px_10px_rgba(0,0,0,0.06)]";
  const bg = isSender ? senderBg : receivedBg;
  const roundSender = "rounded-tr-md";
  const roundReceived = "rounded-tl-md";
  const round = isSender ? roundSender : roundReceived;

  if (isAudio) {
    return (
      <div className={`px-3 py-2.5 rounded-2xl ${bg} ${round} w-[240px] relative`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Music className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xs font-medium truncate flex-1">{fileName || "Audio"}</p>
        </div>
        <audio src={fileUrl} controls preload="metadata" className="w-full h-8" />
        {uploadProgress != null && <UploadOverlay progress={uploadProgress} />}
      </div>
    );
  }

  if (isImage) {
    return (
      <>
        {lightboxSrc && <ImageLightbox src={lightboxSrc} type="image" onClose={() => setLightboxSrc(null)} />}
        <div className={`p-2 rounded-2xl ${bg} ${round} relative`}>
          <img
            src={fileUrl}
            alt={fileName || "attachment"}
            className="rounded-xl max-w-full max-h-52 object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => uploadProgress == null && openLightbox("image")}
          />
          {uploadProgress != null && <UploadOverlay progress={uploadProgress} />}
        </div>
      </>
    );
  }

  if (isVideo) {
    return (
      <>
        {lightboxSrc && <ImageLightbox src={lightboxSrc} type="video" onClose={() => setLightboxSrc(null)} />}
        <div className={`p-2 rounded-2xl ${bg} ${round} max-w-[280px]`}>
          <div className="relative cursor-pointer group" onClick={() => uploadProgress == null && openLightbox("video")}>
            <video
              src={fileUrl}
              preload="metadata"
              className="rounded-xl max-w-full max-h-48 object-contain pointer-events-none"
              style={{ maxWidth: "260px" }}
            />
            {uploadProgress != null ? (
              <UploadOverlay progress={uploadProgress} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl group-hover:bg-black/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 text-black ml-0.5 fill-black" />
                </div>
              </div>
            )}
          </div>
          {fileName && <p className="text-[10px] opacity-50 mt-1 truncate">{fileName}</p>}
        </div>
      </>
    );
  }

  // Generic file
  const ext = fileUrl.split(".").pop()?.toUpperCase() ?? "FILE";
  const IconComp = ext === "MP4" || ext === "WEBM" ? Video :
    ext === "MP3" || ext === "WAV" || ext === "AAC" ? Music : FileText;

  return (
    <div className={`p-3.5 rounded-2xl ${bg} ${round} max-w-[220px] w-full relative`}>
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
      {uploadProgress != null && <UploadOverlay progress={uploadProgress} />}
    </div>
  );
}
