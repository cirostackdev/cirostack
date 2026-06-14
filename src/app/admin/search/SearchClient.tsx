"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";

interface ApiResults {
  messages: { id: string; body: string; createdAt: string; conversationId: string; visitorName: string | null; visitorEmail: string | null; topic: string | null }[];
  conversations: { id: string; visitorName: string | null; visitorEmail: string | null; topic: string | null; status: string; lastMessage: string | null }[];
}

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ApiResults>({ messages: [], conversations: [] });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.trim().length < 2) { setResults({ messages: [], conversations: [] }); setSearched(false); return; }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults({ messages: data.messages ?? [], conversations: data.conversations ?? [] });
      }
      setLoading(false);
      setSearched(true);
    }, 300);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  function snippet(text: string) {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text.slice(0, 120) + (text.length > 120 ? "…" : "");
    const start = Math.max(0, idx - 40);
    const end = Math.min(text.length, idx + query.length + 60);
    return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
  }

  const hasResults = results.messages.length > 0 || results.conversations.length > 0;

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
      {searched && !hasResults && !loading && (
        <p className="text-sm text-muted-foreground text-center py-8">No results found for "{query}"</p>
      )}

      {/* Conversations matching name/email/topic */}
      {results.conversations.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Conversations</p>
          {results.conversations.map((c) => (
            <Link key={c.id} href={`/admin/conversations/${c.id}`}
              className="block border border-border rounded-lg p-4 hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary shrink-0" />
                <span className="font-medium text-sm">{c.visitorName || c.visitorEmail || "Anonymous"}</span>
                {c.topic && <span className="text-xs text-muted-foreground">• {c.topic}</span>}
                <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-medium ${c.status === "open" ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                  {c.status}
                </span>
              </div>
              {c.lastMessage && <p className="text-xs text-muted-foreground mt-1 truncate">{c.lastMessage}</p>}
            </Link>
          ))}
        </div>
      )}

      {/* Messages matching body */}
      {results.messages.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Messages</p>
          {results.messages.map((m) => (
            <Link key={m.id} href={`/admin/conversations/${m.conversationId}`}
              className="block border border-border rounded-lg p-4 hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-primary shrink-0" />
                <span className="font-medium text-sm">{m.visitorName || m.visitorEmail || "Anonymous"}</span>
                {m.topic && <span className="text-xs text-muted-foreground">• {m.topic}</span>}
                <span className="text-[11px] text-muted-foreground ml-auto">
                  {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-xs text-foreground">{snippet(m.body)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
