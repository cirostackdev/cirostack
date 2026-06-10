"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
}

export default function AdminNotificationSendPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [href, setHref] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        if (Array.isArray(data)) setClients(data);
        else if (data?.clients) setClients(data.clients);
      })
      .catch(() => {});
  }, []);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) { toast.error("Please select a client"); return; }
    if (!title.trim()) { toast.error("Title is required"); return; }
    if (!body.trim()) { toast.error("Body is required"); return; }

    setSending(true);
    try {
      const res = await fetch("/api/admin/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, title: title.trim(), body: body.trim(), href: href.trim() || undefined }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to send notification");
        return;
      }
      toast.success("Notification sent successfully");
      setTitle("");
      setBody("");
      setHref("");
      setClientId("");
      setSearch("");
    } catch {
      toast.error("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminShell title="Send Notification">
      <div className="max-w-xl">
        <form onSubmit={handleSend} className="space-y-5">
          {/* Client selection */}
          <div>
            <Label className="text-sm font-medium block mb-1.5">Client</Label>
            <Input
              placeholder="Search clients by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setClientId("");
              }}
              className="text-sm"
            />
            {search && !clientId && (
              <div className="mt-1 max-h-40 overflow-y-auto border border-border rounded-lg bg-background shadow-sm">
                {filteredClients.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-muted-foreground">No clients found</p>
                ) : (
                  filteredClients.slice(0, 10).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setClientId(c.id);
                        setSearch(`${c.name} (${c.email})`);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <span className="font-medium">{c.name}</span>{" "}
                      <span className="text-muted-foreground">{c.email}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <Label className="text-sm font-medium block mb-1.5">Title</Label>
            <Input
              placeholder="Notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm"
              required
            />
          </div>

          {/* Body */}
          <div>
            <Label className="text-sm font-medium block mb-1.5">Body</Label>
            <textarea
              placeholder="Notification body..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              required
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary resize-y"
            />
          </div>

          {/* Href (optional) */}
          <div>
            <Label className="text-sm font-medium block mb-1.5">Link (optional)</Label>
            <Input
              placeholder="/portal/projects/..."
              value={href}
              onChange={(e) => setHref(e.target.value)}
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">Where the notification links to when clicked.</p>
          </div>

          <Button type="submit" disabled={sending} className="gap-2">
            <Send className="w-4 h-4" />
            {sending ? "Sending..." : "Send Notification"}
          </Button>
        </form>
      </div>
    </AdminShell>
  );
}
