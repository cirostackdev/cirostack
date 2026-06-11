"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square, Send, Trash2, Loader2, Play, Pause } from "lucide-react";
import { toast } from "sonner";

type Stage = "idle" | "recording" | "preview" | "uploading";

interface VoiceNoteButtonProps {
  uploadEndpoint: string;
  onSend: (file: File) => void;
  disabled?: boolean;
  onStageChange?: (active: boolean) => void;
}

function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  const start = () => {
    setSeconds(0);
    ref.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };
  const stop = () => {
    if (ref.current) clearInterval(ref.current);
  };
  const reset = () => { stop(); setSeconds(0); };
  const fmt = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  return { seconds, fmt, start, stop, reset };
}

function fmtSecs(s: number) {
  if (!isFinite(s) || isNaN(s)) return "--:--";
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

function PreviewPlayer({ audioUrl, onDiscard, onSend }: { audioUrl: string; onDiscard: () => void; onSend: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const probingRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => { if (!probingRef.current) setCurrent(el.currentTime); };
    const onEnd = () => { setPlaying(false); setCurrent(0); el.currentTime = 0; };
    const onMeta = () => {
      if (isFinite(el.duration)) { setDuration(el.duration); }
      else { probingRef.current = true; el.currentTime = 1e9; }
    };
    const onSeeked = () => {
      if (!probingRef.current) return;
      probingRef.current = false;
      if (isFinite(el.duration)) setDuration(el.duration);
      el.currentTime = 0;
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

  const displayTime = duration > 0 ? fmtSecs(duration - current) : "--:--";

  return (
    <div className="flex items-center gap-1.5 flex-1 min-w-0">
      <audio ref={audioRef} src={audioUrl} preload="metadata" className="hidden" />

      {/* Discard */}
      <button type="button" onClick={onDiscard}
        className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0">
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Waveform pill */}
      <div className="flex-1 flex items-center gap-2 bg-muted/50 border border-border rounded-full px-2.5 h-11 min-w-0">
        <button type="button" onClick={toggle}
          className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity">
          {playing ? <Pause className="w-3 h-3 fill-current text-primary" /> : <Play className="w-3 h-3 fill-current text-primary ml-0.5" />}
        </button>
        <div className="flex items-end gap-[2px] flex-1 h-5">
          {[...Array(16)].map((_, i) => (
            <span key={i} className="flex-1 rounded-full bg-primary opacity-60"
              style={{
                height: "100%",
                transformOrigin: "bottom",
                animation: playing ? `voiceBar 0.8s ease-in-out ${(i * 0.05).toFixed(2)}s infinite alternate` : "none",
                transform: playing ? undefined : `scaleY(${0.15 + (Math.sin(i * 0.8) * 0.5 + 0.5) * 0.85})`,
              }} />
          ))}
        </div>
        <span className="text-[10px] font-mono tabular-nums text-muted-foreground shrink-0">{displayTime}</span>
      </div>

      {/* Send */}
      <button type="button" onClick={onSend}
        className="w-11 h-11 bg-primary text-primary-foreground rounded-full flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity">
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}

export function VoiceNoteButton({ onSend, disabled, onStageChange }: VoiceNoteButtonProps) {
  const [stage, setStage] = useState<Stage>("idle");
  const setStageWithNotify = (s: Stage) => {
    setStage(s);
    onStageChange?.(s !== "idle");
  };
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timer = useTimer();

  // Cleanup on unmount
  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    timer.reset();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")
        ? "audio/ogg;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setStageWithNotify("preview");
        timer.stop();
      };

      recorderRef.current = recorder;
      recorder.start(100);
      timer.start();
      setStageWithNotify("recording");
    } catch {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
  };

  const discard = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioBlob(null);
    timer.reset();
    setStageWithNotify("idle");
  };

  const send = async () => {
    if (!audioBlob) return;
    // Strip codec suffix (e.g. "audio/webm;codecs=opus" → "audio/webm") so upload API accepts it
    const baseMime = audioBlob.type.split(";")[0];
    const ext = baseMime.includes("ogg") ? "ogg" : "webm";
    const file = new File([audioBlob], `voice-note-${Date.now()}.${ext}`, { type: baseMime });
    onSend(file);
    discard();
  };

  // ----- IDLE: just mic button -----
  if (stage === "idle") {
    return (
      <button
        type="button"
        onClick={startRecording}
        disabled={disabled}
        className="w-11 h-11 bg-primary text-primary-foreground rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity"
        title="Record voice note"
      >
        <Mic className="w-4 h-4" />
      </button>
    );
  }

  // ----- RECORDING -----
  if (stage === "recording") {
    return (
      <div className="flex items-center gap-2 flex-1">
        {/* Animated waveform */}
        <div className="flex-1 flex items-center gap-1 bg-red-500/10 border border-red-500/30 rounded-full px-4 h-11">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <div className="flex items-end gap-[3px] flex-1 justify-center h-5">
            {[...Array(16)].map((_, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-red-400 opacity-80"
                style={{
                  height: "100%",
                  animation: `voiceBar 0.8s ease-in-out ${(i * 0.05).toFixed(2)}s infinite alternate`,
                  transformOrigin: "bottom",
                }}
              />
            ))}
          </div>
          <span className="text-xs font-mono text-red-500 shrink-0 tabular-nums">{timer.fmt}</span>
        </div>
        <button
          type="button"
          onClick={stopRecording}
          className="w-11 h-11 bg-red-500 text-white rounded-full flex items-center justify-center shrink-0 hover:bg-red-600 transition-colors"
          title="Stop recording"
        >
          <Square className="w-4 h-4 fill-white" />
        </button>
      </div>
    );
  }

  // ----- PREVIEW -----
  if (stage === "preview") {
    return <PreviewPlayer audioUrl={audioUrl!} onDiscard={discard} onSend={send} />;
  }

  // uploading
  return (
    <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
      <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
    </div>
  );
}
