"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeletons";

interface EventItem {
  id: string;
  slug: string;
  title: string;
  type: string | null;
  date: string;
  published: boolean;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/cms/events")
      .then((r) => r.json())
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/admin/cms/events/${id}`, { method: "DELETE" });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <AdminShell title="Events">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{events.length} events</p>
        <Link href="/admin/cms/events/new">
          <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Event</Button>
        </Link>
      </div>

      {loading ? (
        <AdminTableSkeleton cols={5} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Title</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-t">
                    <td className="p-3 font-medium">{e.title}</td>
                    <td className="p-3 text-muted-foreground">{e.type || "—"}</td>
                    <td className="p-3 text-muted-foreground">{e.date}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${e.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {e.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <Link href={`/admin/cms/events/${e.id}`}>
                        <Button variant="ghost" size="sm"><Pencil className="w-4 h-4" /></Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(e.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr><td colSpan={5} className="p-3 text-center text-muted-foreground">No events yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {events.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No events yet.</p>}
            {events.map((e) => (
              <div key={e.id} className="p-4 rounded-xl border border-border">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{e.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{e.type || "—"} · {e.date}</p>
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${e.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {e.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3 justify-end">
                  <Link href={`/admin/cms/events/${e.id}`}>
                    <Button variant="ghost" size="icon" className="w-8 h-8"><Pencil className="w-3.5 h-3.5" /></Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => handleDelete(e.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminShell>
  );
}
