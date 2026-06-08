"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeletons";
import { PUBLISH_STATUS_COLORS } from "@/lib/colors";

interface AnnouncementItem {
  id: string;
  slug: string;
  type: string | null;
  title: string;
  date: string;
  tag: string | null;
  featured: boolean;
  published: boolean;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/cms/announcements")
      .then((r) => r.json())
      .then(setAnnouncements)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/admin/cms/announcements/${id}`, { method: "DELETE" });
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <AdminShell title="Announcements / Newsroom">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{loading ? <span className="inline-block h-4 w-16 rounded bg-muted animate-pulse" /> : <>{announcements.length} announcements</>}</p>
        <Link href="/admin/cms/announcements/new">
          <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Announcement</Button>
        </Link>
      </div>

      {loading ? (
        <AdminTableSkeleton cols={6} />
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
                  <th className="text-left p-3 font-medium">Tag</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="p-3 font-medium">{a.title}</td>
                    <td className="p-3 text-muted-foreground">{a.type || "—"}</td>
                    <td className="p-3 text-muted-foreground">{new Date(a.date).toLocaleDateString()}</td>
                    <td className="p-3 text-muted-foreground">{a.tag || "—"}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${a.published ? PUBLISH_STATUS_COLORS.published : PUBLISH_STATUS_COLORS.draft}`}>
                        {a.published ? "Published" : "Draft"}
                      </span>
                      {a.featured && <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${PUBLISH_STATUS_COLORS.featured}`}>Featured</span>}
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <Link href={`/admin/cms/announcements/${a.id}`}>
                        <Button variant="ghost" size="sm"><Pencil className="w-4 h-4" /></Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(a.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {announcements.length === 0 && (
                  <tr><td colSpan={6} className="p-3 text-center text-muted-foreground">No announcements yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {announcements.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No announcements yet.</p>}
            {announcements.map((a) => (
              <div key={a.id} className="p-4 rounded-xl border border-border">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {[a.type, a.tag, new Date(a.date).toLocaleDateString()].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${a.published ? PUBLISH_STATUS_COLORS.published : PUBLISH_STATUS_COLORS.draft}`}>
                      {a.published ? "Published" : "Draft"}
                    </span>
                    {a.featured && <span className={`text-xs px-2 py-0.5 rounded-full ${PUBLISH_STATUS_COLORS.featured}`}>Featured</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 justify-end">
                  <Link href={`/admin/cms/announcements/${a.id}`}>
                    <Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs"><Pencil className="w-3.5 h-3.5" /> Edit</Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => handleDelete(a.id)}>
                    <Trash2 className="w-3.5 h-3.5" /> Delete
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
