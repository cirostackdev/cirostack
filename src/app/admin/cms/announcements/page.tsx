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

interface AnnouncementItem { id: string; slug: string; type: string | null; title: string; date: string; tag: string | null; featured: boolean; published: boolean }

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/cms/announcements").then((r) => r.json()).then(setAnnouncements).finally(() => setLoading(false));
  }, []);

  async function handleToggle(id: string, field: string, value: boolean) {
    setSaving(`${id}-${field}`);
    const res = await fetch(`/api/admin/cms/announcements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    if (res.ok) {
      setAnnouncements((prev) => prev.map((a) => a.id === id ? { ...a, [field]: value } : a));
      toast.success("Updated");
    } else { toast.error("Failed to update"); }
    setSaving(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/admin/cms/announcements/${id}`, { method: "DELETE" });
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <AdminShell title="Announcements / Newsroom">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{loading ? <span className="inline-block h-4 w-16 rounded bg-muted animate-pulse" /> : <>{announcements.length} announcements</>}</p>
        <Link href="/admin/cms/announcements/new"><Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Announcement</Button></Link>
      </div>
      {loading ? <AdminTableSkeleton cols={6} /> : (
        <>
          <div className="hidden md:block rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tag</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {announcements.map((a) => (
                  <tr key={a.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{a.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.type || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(a.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.tag || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <CmsBooleanToggle id={a.id} value={a.published} onLabel="Published" offLabel="Draft" className="w-[76px] text-center" onClass={PUBLISH_STATUS_COLORS.published} offClass={PUBLISH_STATUS_COLORS.draft} onChange={(id, v) => handleToggle(id, "published", v)} saving={saving === `${a.id}-published`} />
                        <CmsBooleanToggle id={a.id} value={a.featured} onLabel="Featured" offLabel="Standard" onClass={PUBLISH_STATUS_COLORS.featured} offClass="bg-muted text-muted-foreground" onChange={(id, v) => handleToggle(id, "featured", v)} saving={saving === `${a.id}-featured`} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/admin/cms/announcements/${a.id}`}><Button variant="ghost" size="icon" className="w-8 h-8"><Pencil className="w-3.5 h-3.5" /></Button></Link>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => handleDelete(a.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {announcements.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No announcements yet.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-2">
            {announcements.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No announcements yet.</p>}
            {announcements.map((a) => (
              <div key={a.id} className="p-4 rounded-xl border border-border">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{[a.type, a.tag, new Date(a.date).toLocaleDateString()].filter(Boolean).join(" · ")}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <CmsBooleanToggle id={a.id} value={a.published} onLabel="Published" offLabel="Draft" className="w-[76px] text-center" onClass={PUBLISH_STATUS_COLORS.published} offClass={PUBLISH_STATUS_COLORS.draft} onChange={(id, v) => handleToggle(id, "published", v)} saving={saving === `${a.id}-published`} />
                    <CmsBooleanToggle id={a.id} value={a.featured} onLabel="Featured" offLabel="Standard" onClass={PUBLISH_STATUS_COLORS.featured} offClass="bg-muted text-muted-foreground" onChange={(id, v) => handleToggle(id, "featured", v)} saving={saving === `${a.id}-featured`} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 justify-end">
                  <Link href={`/admin/cms/announcements/${a.id}`}><Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs"><Pencil className="w-3.5 h-3.5" /> Edit</Button></Link>
                  <Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => handleDelete(a.id)}><Trash2 className="w-3.5 h-3.5" /> Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminShell>
  );
}
