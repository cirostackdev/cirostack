"use client";

import { useState, useRef, useEffect } from "react";
import { FileText, Music, Video, File, Play, Pause } from "lucide-react";
import { ImageLightbox } from "./ImageLightbox";

function fmt(s: number) {
  if (!isFinite(s) || isNaN(s)) return "--:--";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function AudioWavePlayer({ fileUrl, isSender }: { fileUrl: string; isSender: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const probingRef = useRef(false); // tracks whether the 1e9 probe seek is in progress
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => { if (!probingRef.current) setCurrent(el.currentTime); };
    const onEnd = () => { setPlaying(false); setCurrent(0); el.currentTime = 0; };
    const onMeta = () => {
      if (isFinite(el.duration)) {
        setDuration(el.duration);
      } else {
        // MediaRecorder webm has no duration header — one-shot probe seek to force calculation
        probingRef.current = true;
        el.currentTime = 1e9;
      }
    };
    const onSeeked = () => {
      if (!probingRef.current) return; // only act on the probe seek, ignore user seeks
      probingRef.current = false;
      if (isFinite(el.duration)) setDuration(el.duration);
      el.currentTime = 0; // reset to start — this seeked event is NOT probing so it's ignored above
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("seeked", onSeeked);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("seeked", onSeeked);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else { el.play(); setPlaying(true); }
  };

  const accent = isSender ? "bg-green-500/20" : "bg-primary/20";
  const barColor = isSender ? "bg-green-600 dark:bg-green-400" : "bg-primary";

  return (
    <div className="flex items-center gap-2.5 w-[220px]">
      <audio ref={audioRef} src={fileUrl} preload="metadata" className="hidden" />

      {/* Play/Pause button */}
      <button
        type="button"
        onClick={toggle}
        className={`w-9 h-9 rounded-full ${accent} flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity`}
      >
        {playing
          ? <Pause className="w-3.5 h-3.5 fill-current" />
          : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
      </button>

      {/* Waveform bars */}
      <div className="flex items-end gap-[2px] flex-1 h-7">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className={`flex-1 rounded-full ${barColor} opacity-75`}
            style={{
              height: "100%",
              transformOrigin: "bottom",
              animation: playing
                ? `voiceBar 0.8s ease-in-out ${(i * 0.04).toFixed(2)}s infinite alternate`
                : "none",
              transform: playing ? undefined : `scaleY(${0.15 + (Math.sin(i * 0.8) * 0.5 + 0.5) * 0.85})`,
            }}
          />
        ))}
      </div>

      {/* Timer — shows total at rest, counts down during playback */}
      <span className="text-[10px] font-mono tabular-nums opacity-60 shrink-0 w-9 text-right">
        {isFinite(duration) && duration > 0 ? fmt(duration - current) : "--:--"}
      </span>
    </div>
  );
}

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
      <div className={`px-3 py-2.5 rounded-2xl ${bg} ${round} relative`}>
        <AudioWavePlayer fileUrl={fileUrl} isSender={isSender} />
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
