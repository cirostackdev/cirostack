"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, FolderKanban, Plus, Search, Trash2, Loader2, X } from "lucide-react";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeletons";
import { PROJECT_STATUS_COLORS } from "@/lib/colors";
import { InlineStatusSelect } from "@/components/admin/InlineStatusSelect";
import { toast } from "sonner";

type Project = { id: string; title: string; status: string; client: { email: string; name?: string; company?: string }; _count: { updates: number; files: number; invoices: number } };

const statusColors = PROJECT_STATUS_COLORS;
const PROJECT_STATUSES = ["discovery", "proposal", "active", "review", "complete", "paused"];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Single delete modal
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Multi-select & bulk delete
  const [tableSelected, setTableSelected] = useState<Set<string>>(new Set());
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/projects").then((r) => r.json()).then((data) => { setProjects(data); setLoading(false); });
  }, []);

  async function handleStatusChange(id: string, status: string) {
    setSaving(id);
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setProjects((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
      toast.success("Status updated");
    } else {
      toast.error("Failed to update status");
    }
    setSaving(null);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/projects/${deleteTarget.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Project deleted");
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setTableSelected((prev) => { const next = new Set(prev); next.delete(deleteTarget.id); return next; });
    } else {
      toast.error("Failed to delete");
    }
    setDeleteTarget(null);
    setDeleting(false);
  }

  async function confirmBulkDelete() {
    setBulkDeleting(true);
    const ids = [...tableSelected];
    await Promise.all(ids.map((id) => fetch(`/api/admin/projects/${id}`, { method: "DELETE" })));
    setProjects((prev) => prev.filter((p) => !tableSelected.has(p.id)));
    setTableSelected(new Set());
    setShowBulkDelete(false);
    setBulkDeleting(false);
    toast.success(`${ids.length} project${ids.length !== 1 ? "s" : ""} deleted`);
  }

  function toggleTableRow(id: string) {
    setTableSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleTableAll() {
    const ids = filtered.map((p) => p.id);
    const allSelected = ids.length > 0 && ids.every((id) => tableSelected.has(id));
    setTableSelected(allSelected ? new Set() : new Set(ids));
  }

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.title.toLowerCase().includes(q);
  });

  return (
    <AdminShell title="Projects">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm text-muted-foreground shrink-0">
            {loading ? <span className="inline-block h-4 w-14 rounded bg-muted animate-pulse" /> : (
              <>
                {search ? <><span className="text-foreground font-medium">{filtered.length}</span> of </> : null}
                {projects.length} project{projects.length !== 1 ? "s" : ""}
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
        <div className="sm:ml-auto">
          <Link href="/admin/projects/new"><Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Project</Button></Link>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8 text-sm"
          />
        </div>
        {search && (
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs self-start" onClick={() => setSearch("")}>
            <X className="w-3 h-3 mr-1" /> Clear
          </Button>
        )}
      </div>

      {loading ? <AdminTableSkeleton cols={5} /> : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-4 py-3 w-8">
                    <button onClick={toggleTableAll} className={`w-4 h-4 rounded border-2 flex items-center justify-center ${filtered.length > 0 && filtered.every((p) => tableSelected.has(p.id)) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                      {filtered.length > 0 && filtered.every((p) => tableSelected.has(p.id)) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Activity</th>
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
                    <td className="px-4 py-3 text-muted-foreground">{p.client.name ?? p.client.email}</td>
                    <td className="px-4 py-3">
                      <InlineStatusSelect
                        id={p.id}
                        value={p.status}
                        options={PROJECT_STATUSES}
                        colorMap={statusColors}
                        onChange={handleStatusChange}
                        saving={saving === p.id}
                        size="md"
                      />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{p._count.updates} updates · {p._count.files} files · {p._count.invoices} invoices</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/admin/projects/${p.id}`}><Button variant="ghost" size="icon" className="w-8 h-8"><ChevronRight className="w-4 h-4" /></Button></Link>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(p)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                          <FolderKanban className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">{search ? "No projects match your search." : "No projects yet"}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile select all */}
          {filtered.length > 0 && (
            <div className="md:hidden flex items-center justify-between px-1 py-2 mb-1">
              <button onClick={toggleTableAll} className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${filtered.length > 0 && filtered.every((p) => tableSelected.has(p.id)) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                  {filtered.length > 0 && filtered.every((p) => tableSelected.has(p.id)) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                </div>
                {filtered.every((p) => tableSelected.has(p.id)) ? "Deselect All" : `Select All (${filtered.length})`}
              </button>
              {tableSelected.size > 0 && <span className="text-xs text-muted-foreground">{tableSelected.size} selected</span>}
            </div>
          )}

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                  <FolderKanban className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">{search ? "No projects match your search." : "No projects yet"}</p>
              </div>
            )}
            {filtered.map((p) => (
              <div key={p.id} className={`p-4 rounded-xl border ${tableSelected.has(p.id) ? "border-primary bg-primary/5" : "border-border"}`}>
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleTableRow(p.id)} className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${tableSelected.has(p.id) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                    {tableSelected.has(p.id) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/admin/projects/${p.id}`} className="font-medium text-sm hover:underline">{p.title}</Link>
                      <InlineStatusSelect
                        id={p.id}
                        value={p.status}
                        options={PROJECT_STATUSES}
                        colorMap={statusColors}
                        onChange={handleStatusChange}
                        saving={saving === p.id}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.client.name ?? p.client.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p._count.updates} updates · {p._count.files} files · {p._count.invoices} invoices</p>
                    <div className="flex items-center gap-2 mt-3 justify-end">
                      <Link href={`/admin/projects/${p.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 px-3 gap-1.5 text-xs">
                          <ChevronRight className="w-3.5 h-3.5" /> View
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="h-8 px-3 gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => setDeleteTarget(p)}>
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Single delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-background rounded-2xl border border-border shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="font-semibold">Delete project?</h2>
                <p className="text-sm text-muted-foreground mt-1">"{deleteTarget.title}"</p>
                <p className="text-xs text-muted-foreground mt-2">This project will be permanently deleted. This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
              <Button variant="destructive" size="sm" onClick={confirmDelete} disabled={deleting}>
                {deleting ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Deleting…</> : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk delete confirmation modal */}
      {showBulkDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-background rounded-2xl border border-border shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="font-semibold">Delete {tableSelected.size} project{tableSelected.size !== 1 ? "s" : ""}?</h2>
                <p className="text-xs text-muted-foreground mt-2">All selected projects will be permanently deleted. This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowBulkDelete(false)} disabled={bulkDeleting}>Cancel</Button>
              <Button variant="destructive" size="sm" onClick={confirmBulkDelete} disabled={bulkDeleting}>
                {bulkDeleting ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Deleting…</> : `Delete ${tableSelected.size} Project${tableSelected.size !== 1 ? "s" : ""}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
