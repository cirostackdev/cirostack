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

interface PortfolioItem { id: string; slug: string; title: string; client: string; vertical: string; service: string; published: boolean; featured: boolean }

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/cms/portfolio").then((r) => r.json()).then(setProjects).finally(() => setLoading(false));
  }, []);

  async function handleToggle(id: string, field: string, value: boolean) {
    setSaving(`${id}-${field}`);
    const res = await fetch(`/api/admin/cms/portfolio/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    if (res.ok) {
      setProjects((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
      toast.success("Updated");
    } else { toast.error("Failed to update"); }
    setSaving(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this portfolio project?")) return;
    await fetch(`/api/admin/cms/portfolio/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <AdminShell title="Portfolio / Case Studies">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{loading ? <span className="inline-block h-4 w-14 rounded bg-muted animate-pulse" /> : <>{projects.length} projects</>}</p>
        <Link href="/admin/cms/portfolio/new"><Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Project</Button></Link>
      </div>
      {loading ? <AdminTableSkeleton cols={5} /> : (
        <>
          <div className="hidden md:block rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Vertical</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{p.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.client}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.vertical}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <CmsBooleanToggle id={p.id} value={p.published} onLabel="Published" offLabel="Draft" className="w-[76px] text-center" onClass={PUBLISH_STATUS_COLORS.published} offClass={PUBLISH_STATUS_COLORS.draft} onChange={(id, v) => handleToggle(id, "published", v)} saving={saving === `${p.id}-published`} />
                        <CmsBooleanToggle id={p.id} value={p.featured} onLabel="Featured" offLabel="Standard" onClass={PUBLISH_STATUS_COLORS.featured} offClass="bg-muted text-muted-foreground" onChange={(id, v) => handleToggle(id, "featured", v)} className="w-[76px] text-center" saving={saving === `${p.id}-featured`} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/admin/cms/portfolio/${p.id}`}><Button variant="ghost" size="icon" className="w-8 h-8"><Pencil className="w-3.5 h-3.5" /></Button></Link>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No projects yet.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-2">
            {projects.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No projects yet.</p>}
            {projects.map((p) => (
              <div key={p.id} className="p-4 rounded-xl border border-border">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.client} · {p.vertical}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <CmsBooleanToggle id={p.id} value={p.published} onLabel="Published" offLabel="Draft" className="w-[76px] text-center" onClass={PUBLISH_STATUS_COLORS.published} offClass={PUBLISH_STATUS_COLORS.draft} onChange={(id, v) => handleToggle(id, "published", v)} saving={saving === `${p.id}-published`} />
                    <CmsBooleanToggle id={p.id} value={p.featured} onLabel="Featured" offLabel="Standard" onClass={PUBLISH_STATUS_COLORS.featured} offClass="bg-muted text-muted-foreground" onChange={(id, v) => handleToggle(id, "featured", v)} className="w-[76px] text-center" saving={saving === `${p.id}-featured`} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 justify-end">
                  <Link href={`/admin/cms/portfolio/${p.id}`}><Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs"><Pencil className="w-3.5 h-3.5" /> Edit</Button></Link>
                  <Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="w-3.5 h-3.5" /> Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminShell>
  );
}
