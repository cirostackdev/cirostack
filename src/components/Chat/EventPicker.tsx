"use client";

import { useEffect, useState } from "react";
import { X, Check, Lock, Globe } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  published: boolean;
  registrationUrl: string | null;
  imageUrl: string | null;
}

interface EventPickerProps {
  onSend: (body: string) => void;
  onClose: () => void;
}

export function EventPicker({ onSend, onClose }: EventPickerProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"public" | "private">("public");

  useEffect(() => {
    fetch("/api/admin/cms/events")
      .then((r) => r.ok ? r.json() : [])
      .then((data: Event[]) => { setEvents(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSend = () => {
    const chosen = events.filter((e) => selected.has(e.id));
    if (!chosen.length) return;
    const lines = chosen.map((e) => {
      const date = e.date ? (() => { try { return format(new Date(e.date), "MMM d, yyyy"); } catch { return e.date; } })() : "";
      const time = e.time ? ` at ${e.time}` : "";
      const reg = e.registrationUrl ? `\nRegister: ${e.registrationUrl}` : "";
      return `📅 *${e.title}*\n${e.type} · ${date}${time}\n📍 ${e.location}${reg}`;
    });
    onSend(`🗓 *Upcoming Events*\n\n${lines.join("\n\n")}`);
    onClose();
  };

  const publicEvents = events.filter((e) => e.published);
  const privateEvents = events.filter((e) => !e.published);
  const visible = tab === "public" ? publicEvents : privateEvents;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="bg-background rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <h2 className="font-semibold text-sm">Select Events</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border shrink-0">
          {(["public", "private"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-xs font-semibold capitalize flex items-center justify-center gap-1.5 transition-colors ${
                tab === t ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "public" ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              {t === "public" ? `Public (${publicEvents.length})` : `Private (${privateEvents.length})`}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading && <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>}
          {!loading && visible.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No {tab} events found.</p>}
          {visible.map((event) => {
            const active = selected.has(event.id);
            const dateStr = (() => { try { return format(new Date(event.date), "MMM d, yyyy"); } catch { return event.date; } })();
            return (
              <button
                key={event.id}
                type="button"
                onClick={() => toggle(event.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-colors ${
                  active ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                  {active && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.type} · {dateStr}{event.time ? ` · ${event.time}` : ""}</p>
                  <p className="text-xs text-muted-foreground truncate">📍 {event.location}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-4 py-3 border-t border-border shrink-0">
          <button
            onClick={handleSend}
            disabled={selected.size === 0}
            className="w-full h-10 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            Send Events ({selected.size} selected)
          </button>
        </div>
      </div>
    </div>
  );
}
