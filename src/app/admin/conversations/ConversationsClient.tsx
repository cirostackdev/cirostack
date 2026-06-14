"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Tag, Filter, Search, X } from "lucide-react";
import { getPusher } from "@/lib/pusher-client";
import type { Channel } from "pusher-js";
import { PRESENCE } from "@/lib/colors";

interface ConvTag {
  id: string;
  name: string;
  color: string;
}

interface Conversation {
  id: string;
  visitorName: string | null;
  visitorEmail: string | null;
  topic: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  metadata?: { visitorLastSeen?: string; [key: string]: unknown } | null;
  assignedTo: { name: string } | null;
  messages: { body: string; senderType: string }[];
  tags?: ConvTag[];
}

const VISITOR_TTL_MS = 2 * 60 * 1000; // 2 minutes

function isVisitorOnline(conv: Conversation): boolean {
  const ts = conv.metadata?.visitorLastSeen;
  if (!ts) return false;
  return Date.now() - new Date(ts).getTime() < VISITOR_TTL_MS;
}

interface Props {
  initialConversations: Conversation[];
  unreadMap: Record<string, number>;
  allTags: ConvTag[];
}

interface SearchResult {
  messages: { id: string; body: string; createdAt: string; conversationId: string; visitorName: string | null; visitorEmail: string | null; topic: string | null }[];
  conversations: { id: string; visitorName: string | null; visitorEmail: string | null; topic: string | null; status: string; lastMessage: string | null }[];
}

export function ConversationsClient({ initialConversations, unreadMap, allTags }: Props) {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>(unreadMap);
  const [filter, setFilter] = useState<"clients" | "visitors" | "closed">("clients");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult>({ messages: [], conversations: [] });
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [typingConvIds, setTypingConvIds] = useState<Set<string>>(new Set());
  const [recordingConvIds, setRecordingConvIds] = useState<Set<string>>(new Set());
  const [onlineConvIds, setOnlineConvIds] = useState<Set<string>>(new Set());
  const channelRef = useRef<Channel | null>(null);
  const pathname = usePathname();

  // Global search
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (searchQuery.trim().length < 2) { setSearchResults({ messages: [], conversations: [] }); return; }
    searchTimerRef.current = setTimeout(async () => {
      setSearchLoading(true);
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults({ messages: data.messages ?? [], conversations: data.conversations ?? [] });
      }
      setSearchLoading(false);
    }, 300);
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [searchQuery]);

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults({ messages: [], conversations: [] });
  }

  // Refresh conversation list every 60s (for metadata/assignment drift, not presence)
  useEffect(() => {
    const refresh = () =>
      fetch("/api/admin/conversations")
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data) setConversations(data); })
        .catch(() => {});
    const interval = setInterval(refresh, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Subscribe to admin notifications channel for new conversations and messages
    const pusher = getPusher();
    if (!pusher) return;
    const channel = pusher.subscribe("private-admin-notifications");
    channelRef.current = channel;

    channel.bind("conversation-new", ({ conversation }: { conversation: Conversation }) => {
      setConversations((prev) => {
        if (prev.find((c) => c.id === conversation.id)) return prev;
        return [conversation, ...prev];
      });
    });

    channel.bind("new-message", ({ conversationId }: { conversationId: string }) => {
      setUnreadCounts((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || 0) + 1,
      }));
    });

    channel.bind("visitor-typing-notification", ({ conversationId, typing }: { conversationId: string; typing: boolean }) => {
      setTypingConvIds((prev) => {
        const next = new Set(prev);
        if (typing) {
          next.add(conversationId);
        } else {
          next.delete(conversationId);
        }
        return next;
      });
    });

    channel.bind("visitor-recording-notification", ({ conversationId, recording }: { conversationId: string; recording: boolean }) => {
      setRecordingConvIds((prev) => {
        const next = new Set(prev);
        if (recording) {
          next.add(conversationId);
        } else {
          next.delete(conversationId);
        }
        return next;
      });
    });

    channel.bind("visitor-presence-notification", ({ conversationId, online }: { conversationId: string; online: boolean }) => {
      setOnlineConvIds((prev) => {
        const next = new Set(prev);
        if (online) {
          next.add(conversationId);
        } else {
          next.delete(conversationId);
        }
        return next;
      });
    });

    channel.bind("conversation-closed-notification", ({ conversationId }: { conversationId: string }) => {
      setConversations((prev) =>
        prev.map((c) => c.id === conversationId ? { ...c, status: "closed" } : c)
      );
    });

    channel.bind("conversation-assigned", ({ conversationId, assignedTo }: { conversationId: string; assignedTo: { id: string; name: string } | null }) => {
      setConversations((prev) =>
        prev.map((c) => c.id === conversationId ? { ...c, assignedTo: assignedTo ?? null } : c)
      );
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe("private-admin-notifications");
    };
  }, []);

  const isPortalClient = (c: Conversation) => (c.metadata as any)?.source === "portal";

  const filtered = conversations.filter((c) => {
    if (filter === "closed" && c.status !== "closed") return false;
    if (filter === "clients" && !(c.status === "open" && isPortalClient(c))) return false;
    if (filter === "visitors" && !(c.status === "open" && !isPortalClient(c))) return false;
    if (tagFilter && !(c.tags || []).some((t) => t.id === tagFilter)) return false;
    return true;
  });

  const hasSearchResults = searchResults.messages.length > 0 || searchResults.conversations.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header: Tabs or Search */}
      <div className="flex items-center gap-1.5 px-3 pt-3 pb-3 border-b border-border">
      {searchOpen ? (
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              ref={searchInputRef}
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations…"
              className="w-full bg-muted border border-border rounded-lg pl-8 pr-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button onClick={closeSearch} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
        {([
          { key: "clients", label: "Clients", count: conversations.filter((c) => c.status === "open" && isPortalClient(c)).length },
          { key: "visitors", label: "Visitors", count: conversations.filter((c) => c.status === "open" && !isPortalClient(c)).length },
          { key: "closed", label: "Closed", count: conversations.filter((c) => c.status === "closed").length },
        ] as const).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
            <span className="ml-1.5 opacity-60">({count})</span>
          </button>
        ))}
        {allTags.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowTagFilter(!showTagFilter)}
              className={`p-1.5 rounded-lg transition-colors ${tagFilter ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
              title="Filter by tag"
            >
              <Filter className="w-3.5 h-3.5" />
            </button>
            {showTagFilter && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
                <button
                  onClick={() => { setTagFilter(null); setShowTagFilter(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors ${!tagFilter ? "font-semibold text-primary" : ""}`}
                >
                  All tags
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => { setTagFilter(tag.id); setShowTagFilter(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors flex items-center gap-2 ${tagFilter === tag.id ? "font-semibold" : ""}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <button onClick={() => setSearchOpen(true)} className="ml-auto p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Search">
          <Search className="w-3.5 h-3.5" />
        </button>
        </>
      )}
      </div>

      {/* Search results */}
      {searchOpen && (
        <div className="flex-1 overflow-y-auto divide-y divide-border/50">
          {searchLoading && (
            <p className="text-xs text-muted-foreground text-center py-6">Searching…</p>
          )}
          {!searchLoading && searchQuery.length >= 2 && !hasSearchResults && (
            <p className="text-xs text-muted-foreground text-center py-6">No results for "{searchQuery}"</p>
          )}
          {!searchLoading && searchQuery.length < 2 && (
            <p className="text-xs text-muted-foreground text-center py-6">Type to search conversations</p>
          )}
          {[...searchResults.conversations.map(c => ({ type: "conv" as const, data: c })),
            ...searchResults.messages.map(m => ({ type: "msg" as const, data: m }))
          ].map((item, i) => {
            if (item.type === "conv") {
              const c = item.data;
              return (
                <button key={`c-${c.id}`} onClick={() => { router.push(`/admin/conversations/${c.id}`); closeSearch(); }}
                  className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors">
                  <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c.visitorName || c.visitorEmail || "Anonymous"}</p>
                    {c.topic && <p className="text-xs text-muted-foreground truncate">{c.topic}</p>}
                    {c.lastMessage && <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>}
                  </div>
                </button>
              );
            }
            const m = item.data;
            return (
              <button key={`m-${m.id}`} onClick={() => { router.push(`/admin/conversations/${m.conversationId}`); closeSearch(); }}
                className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors">
                <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground truncate">{m.visitorName || m.visitorEmail || "Anonymous"}{m.topic ? ` · ${m.topic}` : ""}</p>
                  <p className="text-sm truncate">{m.body.slice(0, 100)}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* List — hidden when search is open */}
      <div className={`${searchOpen ? "hidden" : "flex-1"} overflow-y-auto divide-y divide-border/50`}>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground">No conversations</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Conversations will appear here when visitors start chatting.
            </p>
          </div>
        )}

        {filtered.map((conv) => {
          const unread = unreadCounts[conv.id] || 0;
          const lastMsg = conv.messages[0];
          const isTyping = typingConvIds.has(conv.id);
          const isRecording = recordingConvIds.has(conv.id);
          const isOnline = onlineConvIds.has(conv.id) || isVisitorOnline(conv);
          const initials = conv.visitorName
            ? conv.visitorName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
            : "?";

          return (
            <Link
              key={conv.id}
              href={`/admin/conversations/${conv.id}`}
              className={`flex items-start gap-3.5 px-4 py-4 transition-colors ${
                pathname === `/admin/conversations/${conv.id}`
                  ? "bg-muted border-l-2 border-primary"
                  : unread > 0
                  ? "bg-primary/5 hover:bg-primary/10 border-l-2 border-transparent"
                  : "hover:bg-muted/40 border-l-2 border-transparent"
              }`}
            >
              {/* Avatar with presence dot */}
              <div className="relative shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {initials}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                    isOnline ? PRESENCE.online : PRESENCE.offline
                  }`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className={`text-sm truncate ${unread > 0 ? "font-bold text-foreground" : "font-semibold text-foreground"}`}>
                    {conv.visitorName || "Anonymous visitor"}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {unread > 0 && (
                      <span className="w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                    <span className={`text-[11px] font-medium ${unread > 0 ? "text-primary" : "text-muted-foreground"}`}>
                      {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <p className={`text-xs truncate ${isTyping || isRecording ? "text-primary italic" : unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {isTyping ? "typing…" : isRecording ? "recording…" : lastMsg ? lastMsg.body : conv.topic || "No messages yet"}
                </p>

                {conv.assignedTo && (
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                    Assigned to {conv.assignedTo.name}
                  </p>
                )}
                {(conv.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {conv.tags!.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted/80"
                        style={{ color: tag.color }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
