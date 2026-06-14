"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [tableSelected, setTableSelected] = useState<Set<string>>(new Set());
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioItem | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/admin/cms/portfolio/${deleteTarget.id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setTableSelected((prev) => { const next = new Set(prev); next.delete(deleteTarget.id); return next; });
    setDeleteTarget(null);
    setDeleting(false);
  }

  function toggleTableRow(id: string) {
    setTableSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleTableAll() {
    const ids = filtered.map(p => p.id);
    const allSelected = ids.length > 0 && ids.every(id => tableSelected.has(id));
    setTableSelected(allSelected ? new Set() : new Set(ids));
  }

  async function confirmBulkDelete() {
    setBulkDeleting(true);
    const ids = [...tableSelected];
    await Promise.all(ids.map(id => fetch(`/api/admin/cms/portfolio/${id}`, { method: "DELETE" })));
    setProjects(prev => prev.filter(p => !tableSelected.has(p.id)));
    setTableSelected(new Set());
    setShowBulkDelete(false);
    setBulkDeleting(false);
  }

  const filtered = projects.filter(project =>
    !search.trim() || project.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell title="Portfolio / Case Studies">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm text-muted-foreground">
            {loading ? <span className="inline-block h-4 w-14 rounded bg-muted animate-pulse" /> : (
              <>
                {search ? <><span className="text-foreground font-medium">{filtered.length}</span> of </> : null}
                {projects.length} projects
              </>
            )}
          </p>
          {tableSelected.size > 0 && (
            <Button size="sm" variant="destructive" onClick={() => setShowBulkDelete(true)}>
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete {tableSelected.size} selected
            </Button>
          )}
        </div>
        <Link href="/admin/cms/portfolio/new"><Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Project</Button></Link>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects…" className="pl-9" />
      </div>

      {loading ? <AdminTableSkeleton cols={5} /> : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-4 py-3 w-8">
                    <button onClick={toggleTableAll} className={`w-4 h-4 rounded border-2 flex items-center justify-center ${filtered.length > 0 && filtered.every(p => tableSelected.has(p.id)) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                      {filtered.length > 0 && filtered.every(p => tableSelected.has(p.id)) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Vertical</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className={`border-t border-border hover:bg-muted/20 transition-colors ${tableSelected.has(p.id) ? "bg-primary/5" : ""}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleTableRow(p.id)} className={`w-4 h-4 rounded border-2 flex items-center justify-center ${tableSelected.has(p.id) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                        {tableSelected.has(p.id) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                      </button>
                    </td>
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
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(p)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">{search ? "No projects match your search." : "No projects yet."}</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Mobile select all */}
          {filtered.length > 0 && (
            <div className="md:hidden flex items-center justify-between px-1 py-2 mb-1">
              <button onClick={toggleTableAll} className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${filtered.every(p => tableSelected.has(p.id)) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                  {filtered.every(p => tableSelected.has(p.id)) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                </div>
                {filtered.every(p => tableSelected.has(p.id)) ? "Deselect All" : `Select All (${filtered.length})`}
              </button>
              {tableSelected.size > 0 && <span className="text-xs text-muted-foreground">{tableSelected.size} selected</span>}
            </div>
          )}

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">{search ? "No projects match your search." : "No projects yet."}</p>}
            {filtered.map((p) => (
              <div key={p.id} className={`p-4 rounded-xl border ${tableSelected.has(p.id) ? "border-primary bg-primary/5" : "border-border"}`}>
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleTableRow(p.id)} className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${tableSelected.has(p.id) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                    {tableSelected.has(p.id) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.client} · {p.vertical}</p>
                    <div className="flex flex-col items-start gap-1 mt-1.5">
                      <CmsBooleanToggle id={p.id} value={p.published} onLabel="Published" offLabel="Draft" className="w-[76px] text-center" onClass={PUBLISH_STATUS_COLORS.published} offClass={PUBLISH_STATUS_COLORS.draft} onChange={(id, v) => handleToggle(id, "published", v)} saving={saving === `${p.id}-published`} />
                      <CmsBooleanToggle id={p.id} value={p.featured} onLabel="Featured" offLabel="Standard" onClass={PUBLISH_STATUS_COLORS.featured} offClass="bg-muted text-muted-foreground" onChange={(id, v) => handleToggle(id, "featured", v)} className="w-[76px] text-center" saving={saving === `${p.id}-featured`} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 justify-end">
                  <Link href={`/admin/cms/portfolio/${p.id}`}><Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs"><Pencil className="w-3.5 h-3.5" /> Edit</Button></Link>
                  <Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => setDeleteTarget(p)}><Trash2 className="w-3.5 h-3.5" /> Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Bulk delete modal */}
      {showBulkDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-background rounded-2xl border border-border shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="font-semibold">Delete {tableSelected.size} projects?</h2>
                <p className="text-xs text-muted-foreground mt-2">All selected projects will be permanently deleted. This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowBulkDelete(false)} disabled={bulkDeleting}>Cancel</Button>
              <Button variant="destructive" size="sm" onClick={confirmBulkDelete} disabled={bulkDeleting}>
                {bulkDeleting ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Deleting…</> : `Delete ${tableSelected.size} Projects`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Single delete modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-background rounded-2xl border border-border shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="font-semibold">Delete project?</h2>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">"{deleteTarget.title}"</p>
                <p className="text-xs text-muted-foreground mt-2">This project will be permanently deleted. This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
              <Button variant="destructive" size="sm" onClick={confirmDelete} disabled={deleting}>
                {deleting ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Deleting…</> : "Delete Project"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
