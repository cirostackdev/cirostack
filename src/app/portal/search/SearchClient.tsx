"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, FolderKanban, Receipt, FileText, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";

interface Results {
  projects: { id: string; title: string; status: string }[];
  invoices: { id: string; number: string; amount: number; status: string }[];
  files: { id: string; name: string; url: string; project: { title: string } }[];
  messages: { id: string; body: string; createdAt: string; conversationId: string }[];
}

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.trim().length < 2) { setResults(null); return; }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/portal/search?q=${encodeURIComponent(query.trim())}`);
      if (res.ok) setResults(await res.json());
      setLoading(false);
    }, 300);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  const hasResults = results && (results.projects.length || results.invoices.length || results.files.length || results.messages.length);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, invoices, files, messages..."
          className="pl-10"
          autoFocus
        />
      </div>

      {loading && <p className="text-sm text-muted-foreground text-center">Searching...</p>}

      {results && !hasResults && query.length >= 2 && !loading && (
        <p className="text-sm text-muted-foreground text-center py-8">No results found for "{query}"</p>
      )}

      {results?.projects.length ? (
        <Section title="Projects" icon={FolderKanban}>
          {results.projects.map((p) => (
            <Link key={p.id} href={`/portal/projects/${p.id}`} className="block px-4 py-3 rounded-lg hover:bg-muted transition-colors">
              <p className="text-sm font-medium">{p.title}</p>
              <p className="text-xs text-muted-foreground capitalize">{p.status}</p>
            </Link>
          ))}
        </Section>
      ) : null}

      {results?.invoices.length ? (
        <Section title="Invoices" icon={Receipt}>
          {results.invoices.map((inv) => (
            <Link key={inv.id} href={`/portal/invoices/${inv.id}`} className="block px-4 py-3 rounded-lg hover:bg-muted transition-colors">
              <p className="text-sm font-medium">{inv.number}</p>
              <p className="text-xs text-muted-foreground">${(inv.amount / 100).toFixed(2)} — {inv.status}</p>
            </Link>
          ))}
        </Section>
      ) : null}

      {results?.files.length ? (
        <Section title="Files" icon={FileText}>
          {results.files.map((f) => (
            <a key={f.id} href={f.url} target="_blank" rel="noopener" className="block px-4 py-3 rounded-lg hover:bg-muted transition-colors">
              <p className="text-sm font-medium">{f.name}</p>
              <p className="text-xs text-muted-foreground">From: {f.project.title}</p>
            </a>
          ))}
        </Section>
      ) : null}

      {results?.messages.length ? (
        <Section title="Messages" icon={MessageSquare}>
          {results.messages.map((m) => (
            <Link key={m.id} href="/portal/chat" className="block px-4 py-3 rounded-lg hover:bg-muted transition-colors">
              <p className="text-sm line-clamp-2">{m.body}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}</p>
            </Link>
          ))}
        </Section>
      ) : null}
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5" /> {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
