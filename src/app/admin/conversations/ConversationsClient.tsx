"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, X } from "lucide-react";
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
  assignedTo: { name: string } | null;
  messages: { body: string; senderType: string }[];
}

interface Props {
  initialConversations: Conversation[];
  unreadMap: Record<string, number>;
}

export function ConversationsClient({ initialConversations, unreadMap }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>(unreadMap);
  const [filter, setFilter] = useState<"open" | "closed" | "all">("open");
  const [search, setSearch] = useState("");
  const channelRef = useRef<Channel | null>(null);

  useEffect(() => {
    const sendHeartbeat = () =>
      fetch("/api/chat/heartbeat", { method: "POST" }).catch(() => {});
    sendHeartbeat();
    const heartbeatInterval = setInterval(sendHeartbeat, 60_000);

    // Subscribe to admin notifications channel for new conversations and messages
    const pusher = getPusher();
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

    return () => {
      clearInterval(heartbeatInterval);
      channel.unbind_all();
      pusher.unsubscribe("private-admin-notifications");
    };
  }, []);

  const filtered = conversations.filter((c) => {
    const matchFilter = filter === "all" || c.status === filter;
    if (!matchFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (c.visitorName ?? "").toLowerCase().includes(q) ||
      (c.visitorEmail ?? "").toLowerCase().includes(q) ||
      (c.topic ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 px-4 pt-4 pb-3 border-b border-border">
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Search name, email or topic…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 text-sm pl-3 pr-8 rounded-lg bg-muted border border-border outline-none focus:ring-1 focus:ring-primary"
          />
          {search && (
            <button className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setSearch("")}>
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="flex gap-1.5">
          {(["open", "closed", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
              <span className="ml-1.5 opacity-60">
                ({conversations.filter((c) => f === "all" || c.status === f).length})
              </span>
            </button>
          ))}
        </div>
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
              {search ? "Try a different search term." : "Conversations will appear here when visitors start chatting."}
            </p>
          </div>
        )}

        {filtered.map((conv) => {
          const unread = unreadCounts[conv.id] || 0;
          const lastMsg = conv.messages[0];
          const initials = conv.visitorName
            ? conv.visitorName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
            : "?";

          return (
            <Link
              key={conv.id}
              href={`/admin/conversations/${conv.id}`}
              className={`flex items-start gap-3.5 px-4 py-4 hover:bg-muted/40 transition-colors ${
                unread > 0 ? "bg-primary/5 hover:bg-primary/10" : ""
              }`}
            >
              {/* Avatar with presence dot */}
              <div className="relative shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {initials}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                    conv.status === "open" ? PRESENCE.online : PRESENCE.offline
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

                <p className={`text-xs truncate ${unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {lastMsg ? lastMsg.body : conv.topic || "No messages yet"}
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
