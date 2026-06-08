"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeletons";
import { PUBLISH_STATUS_COLORS } from "@/lib/colors";
import { CmsBooleanToggle } from "@/components/admin/CmsBooleanToggle";
import { toast } from "sonner";

interface EventItem { id: string; slug: string; title: string; type: string | null; date: string; published: boolean }

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/cms/events").then((r) => r.json()).then(setEvents).finally(() => setLoading(false));
  }, []);

  async function handleToggle(id: string, value: boolean) {
    setSaving(id);
    const res = await fetch(`/api/admin/cms/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: value }),
    });
    if (res.ok) {
      setEvents((prev) => prev.map((e) => e.id === id ? { ...e, published: value } : e));
      toast.success("Updated");
    } else { toast.error("Failed to update"); }
    setSaving(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/admin/cms/events/${id}`, { method: "DELETE" });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <AdminShell title="Events">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{loading ? <span className="inline-block h-4 w-12 rounded bg-muted animate-pulse" /> : <>{events.length} events</>}</p>
        <Link href="/admin/cms/events/new"><Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Event</Button></Link>
      </div>
      {loading ? <AdminTableSkeleton cols={5} /> : (
        <>
          <div className="hidden md:block rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{e.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.type || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.date}</td>
                    <td className="px-4 py-3">
                      <CmsBooleanToggle id={e.id} value={e.published} onLabel="Published" offLabel="Draft" onClass={PUBLISH_STATUS_COLORS.published} offClass={PUBLISH_STATUS_COLORS.draft} onChange={(id, v) => handleToggle(id, v)} saving={saving === e.id} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/admin/cms/events/${e.id}`}><Button variant="ghost" size="icon" className="w-8 h-8"><Pencil className="w-3.5 h-3.5" /></Button></Link>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => handleDelete(e.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No events yet.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-2">
            {events.length === 0 && <p className="text-sm text-muted-foreground text-center py-8 border border-dashed border-border rounded-xl">No events yet.</p>}
            {events.map((e) => (
              <div key={e.id} className="p-4 rounded-xl border border-border">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{e.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{e.type || "—"} · {e.date}</p>
                  </div>
                  <CmsBooleanToggle id={e.id} value={e.published} onLabel="Published" offLabel="Draft" onClass={PUBLISH_STATUS_COLORS.published} offClass={PUBLISH_STATUS_COLORS.draft} onChange={(id, v) => handleToggle(id, v)} saving={saving === e.id} />
                </div>
                <div className="flex items-center gap-1 mt-3 justify-end">
                  <Link href={`/admin/cms/events/${e.id}`}><Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs"><Pencil className="w-3.5 h-3.5" /> Edit</Button></Link>
                  <Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => handleDelete(e.id)}><Trash2 className="w-3.5 h-3.5" /> Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminShell>
  );
}
