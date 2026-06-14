"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";

interface SearchResult {
  conversation: { id: string; visitorName: string | null; visitorEmail: string | null; topic: string | null; status: string };
  messages: { id: string; body: string; senderType: string; senderName: string | null; createdAt: string }[];
}

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.trim().length < 2) { setResults([]); setSearched(false); return; }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      }
      setLoading(false);
      setSearched(true);
    }, 300);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  function highlight(text: string) {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text.slice(0, 150);
    const start = Math.max(0, idx - 40);
    const end = Math.min(text.length, idx + query.length + 60);
    const snippet = (start > 0 ? "..." : "") + text.slice(start, end) + (end < text.length ? "..." : "");
    return snippet;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search across all conversations..."
          className="pl-10 text-base"
          autoFocus
        />
      </div>

      {loading && <p className="text-sm text-muted-foreground text-center">Searching...</p>}

      {searched && results.length === 0 && !loading && (
        <p className="text-sm text-muted-foreground text-center py-8">No results found for "{query}"</p>
      )}

      <div className="space-y-4">
        {results.map((group) => (
          <Link
            key={group.conversation.id}
            href={`/admin/conversations/${group.conversation.id}`}
            className="block border border-border rounded-lg p-4 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">{group.conversation.visitorName || group.conversation.visitorEmail || "Anonymous"}</span>
              {group.conversation.topic && (
                <span className="text-xs text-muted-foreground">• {group.conversation.topic}</span>
              )}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${group.conversation.status === "open" ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                {group.conversation.status}
              </span>
            </div>
            <div className="space-y-1.5">
              {group.messages.slice(0, 3).map((msg) => (
                <div key={msg.id} className="text-xs">
                  <span className="font-medium text-muted-foreground">
                    {msg.senderType === "agent" ? msg.senderName || "Agent" : "Visitor"}:
                  </span>{" "}
                  <span className="text-foreground">{highlight(msg.body)}</span>
                  <span className="text-muted-foreground/60 ml-2">
                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                  </span>
                </div>
              ))}
              {group.messages.length > 3 && (
                <p className="text-[11px] text-muted-foreground">+{group.messages.length - 3} more matches</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
