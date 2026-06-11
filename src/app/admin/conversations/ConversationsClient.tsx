"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";
import { getPusher } from "@/lib/pusher-client";
import type { Channel } from "pusher-js";
import { PRESENCE } from "@/lib/colors";

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
}

export function ConversationsClient({ initialConversations, unreadMap }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>(unreadMap);
  const [filter, setFilter] = useState<"clients" | "visitors" | "closed">("clients");
  const [typingConvIds, setTypingConvIds] = useState<Set<string>>(new Set());
  const channelRef = useRef<Channel | null>(null);
  const pathname = usePathname();

  // Refresh conversation list every 60s to keep visitorLastSeen current
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

    return () => {
      channel.unbind_all();
      pusher.unsubscribe("private-admin-notifications");
    };
  }, []);

  const isPortalClient = (c: Conversation) => (c.metadata as any)?.source === "portal";

  const filtered = conversations.filter((c) => {
    if (filter === "closed") return c.status === "closed";
    if (filter === "clients") return c.status === "open" && isPortalClient(c);
    // visitors: open conversations NOT from portal
    return c.status === "open" && !isPortalClient(c);
  });

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex gap-1.5 px-4 pt-4 pb-3 border-b border-border">
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
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/50">
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
                    isVisitorOnline(conv) ? PRESENCE.online : PRESENCE.offline
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

                <p className={`text-xs truncate ${isTyping ? "text-primary italic" : unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {isTyping ? "typing…" : lastMsg ? lastMsg.body : conv.topic || "No messages yet"}
                </p>

                {conv.assignedTo && (
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                    Assigned to {conv.assignedTo.name}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
