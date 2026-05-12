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
        <div className="border rounded-lg overflow-hidden">
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
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
