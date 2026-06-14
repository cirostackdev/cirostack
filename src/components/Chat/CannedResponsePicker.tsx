"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

interface CannedResponse {
  id: string;
  title: string;
  shortcut: string | null;
  content: string;
  category: string;
}

export function CannedResponsePicker({
  query,
  onSelect,
  onClose,
}: {
  query: string;
  onSelect: (content: string) => void;
  onClose: () => void;
}) {
  const [responses, setResponses] = useState<CannedResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/canned-responses")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setResponses(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = responses.filter((r) => {
    const q = query.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      (r.shortcut && r.shortcut.toLowerCase().includes(q)) ||
      r.content.toLowerCase().includes(q)
    );
  });

  if (loading) return null;
  if (filtered.length === 0 && query) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-1 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
      <div className="py-1">
        {(query ? filtered : responses.slice(0, 8)).map((r) => (
          <button
            key={r.id}
            onClick={() => { onSelect(r.content); onClose(); }}
            className="w-full text-left px-3 py-2 hover:bg-muted transition-colors flex items-start gap-2"
          >
            <MessageCircle className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">{r.title}</span>
                {r.shortcut && <code className="text-[10px] text-muted-foreground">/{r.shortcut}</code>}
              </div>
              <p className="text-[11px] text-muted-foreground truncate">{r.content}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
