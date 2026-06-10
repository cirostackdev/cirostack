"use client";

import { useRef, useState } from "react";
import { Paperclip, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FileUploadButtonProps {
  uploadEndpoint: string;
  onUpload: (result: { url: string; name: string; type: string }) => void;
  disabled?: boolean;
}

const ACCEPT = [
  "image/*",
  "video/mp4,video/webm,video/ogg,video/quicktime",
  "audio/mpeg,audio/mp4,audio/ogg,audio/wav,audio/webm,audio/aac",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "application/zip",
].join(",");

export function FileUploadButton({ uploadEndpoint, onUpload, disabled }: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(uploadEndpoint, { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Upload failed");
      } else {
        onUpload({ url: data.url, name: data.name, type: data.type });
      }
    } catch {
      toast.error("Upload failed");
    }

    setUploading(false);
    e.target.value = "";
  };

  return (
    <>
      <button
        type="button"
        onClick={() => !uploading && inputRef.current?.click()}
        disabled={disabled || uploading}
        className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors shrink-0 p-1"
        title="Attach file"
      >
        {uploading
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <Paperclip className="w-4 h-4" />
        }
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={ACCEPT}
        onChange={handleChange}
      />
    </>
  );
}
