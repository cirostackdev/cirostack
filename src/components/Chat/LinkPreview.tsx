"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

interface OgData {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  url: string;
}

const cache = new Map<string, OgData | null>();

export function LinkPreview({ url, isSender }: { url: string; isSender: boolean }) {
  const [og, setOg] = useState<OgData | null>(cache.get(url) ?? null);
  const [loading, setLoading] = useState(!cache.has(url));

  useEffect(() => {
    if (cache.has(url)) {
      setOg(cache.get(url)!);
      setLoading(false);
      return;
    }

    let cancelled = false;
    fetch(`/api/chat/link-preview?url=${encodeURIComponent(url)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: OgData | null) => {
        if (cancelled) return;
        cache.set(url, data);
        setOg(data);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          cache.set(url, null);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [url]);

  if (loading || !og || (!og.title && !og.image)) return null;

  const domain = (() => {
    try { return new URL(url).hostname.replace("www.", ""); } catch { return ""; }
  })();

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block mt-1.5 rounded-xl overflow-hidden border border-border/50 hover:border-border transition-colors ${
        isSender ? "bg-background/30" : "bg-background/50"
      }`}
    >
      {og.image && (
        <div className="w-full h-32 overflow-hidden">
          <img
            src={og.image}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      )}
      <div className="px-3 py-2.5">
        {og.siteName && (
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{og.siteName}</p>
        )}
        {og.title && (
          <p className="text-xs font-semibold line-clamp-2 leading-snug">{og.title}</p>
        )}
        {og.description && (
          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">{og.description}</p>
        )}
        <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground">
          <ExternalLink className="w-3 h-3" />
          <span className="truncate">{domain}</span>
        </div>
      </div>
    </a>
  );
}
