"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, User, Circle } from "lucide-react";
import { getSocket } from "@/lib/socket";

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
  const [filter, setFilter] = useState<"open" | "closed" | "all">("open");

  useEffect(() => {
    // Connect socket as admin to receive real-time updates
    const initSocket = async () => {
      const tokenRes = await fetch("/api/chat/socket-token", { method: "POST" });
      if (!tokenRes.ok) return;
      const { token } = await tokenRes.json();

      const socket = getSocket();
      socket.connect();
      socket.on("connect", () => {
        socket.emit("admin:join", { token });
      });

      socket.on("conversation:new", ({ conversation }: { conversation: Conversation }) => {
        setConversations((prev) => {
          if (prev.find((c) => c.id === conversation.id)) return prev;
          return [conversation, ...prev];
        });
      });
    };

    initSocket();
  }, []);

  const filtered = conversations.filter((c) => {
    if (filter === "all") return true;
    return c.status === filter;
  });

  return (
    <div className="p-4">
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(["open", "closed", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
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

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No conversations yet.
          </div>
        )}

        {filtered.map((conv) => {
          const unread = unreadMap[conv.id] || 0;
          const lastMsg = conv.messages[0];
          return (
            <Link
              key={conv.id}
              href={`/admin/conversations/${conv.id}`}
              className="flex items-start gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm truncate">
                    {conv.visitorName || "Anonymous visitor"}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {unread > 0 && (
                      <span className="w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                    <span className="text-[11px] text-muted-foreground">
                      {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <Circle
                    className={`w-2 h-2 shrink-0 ${
                      conv.status === "open" ? "fill-green-500 text-green-500" : "fill-muted-foreground text-muted-foreground"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground truncate">
                    {lastMsg ? lastMsg.body : conv.topic || "No messages yet"}
                  </span>
                </div>

                {conv.assignedTo && (
                  <span className="text-[11px] text-muted-foreground/60 mt-0.5 block">
                    Assigned to {conv.assignedTo.name}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
