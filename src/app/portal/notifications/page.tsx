"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";

interface Notification {
  id: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
}

type Filter = "all" | "unread";

export default function PortalNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  const fetchNotifications = () => {
    fetch("/api/portal/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setNotifications(data);
        else if (data?.notifications && Array.isArray(data.notifications)) setNotifications(data.notifications);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    await fetch("/api/portal/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: "all" }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClick = async (notif: Notification) => {
    if (!notif.read) {
      await fetch("/api/portal/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [notif.id], read: true }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
    }
    if (notif.href) {
      router.push(notif.href);
    }
  };

  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <PortalShell title="Notifications">
      <div className="w-full">
        {/* Header with filter tabs and mark all read */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === "all"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === "unread"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Unread{unreadCount > 0 && ` (${unreadCount})`}
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-2xl border border-border bg-card animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-14 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-muted mx-auto flex items-center justify-center">
              <Bell className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {filter === "unread" ? "All caught up!" : "No notifications yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
                {filter === "unread"
                  ? "You have no unread notifications."
                  : "When there are updates to your projects or invoices, they will appear here."}
              </p>
            </div>
          </div>
        )}

        {/* Notification list */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-2">
            {filtered.map((notif) => (
              <button
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={`w-full text-left flex items-start gap-3 p-4 rounded-2xl border transition-colors ${
                  notif.read
                    ? "border-border bg-card hover:bg-muted/20"
                    : "border-l-4 border-primary bg-primary/[0.03] hover:bg-primary/[0.06]"
                } ${notif.href ? "cursor-pointer" : "cursor-default"}`}
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                    notif.read ? "bg-transparent" : "bg-primary"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm truncate ${
                      notif.read
                        ? "font-medium text-foreground"
                        : "font-semibold text-foreground"
                    }`}
                  >
                    {notif.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                    {notif.body}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {formatDistanceToNow(new Date(notif.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </PortalShell>
  );
}
