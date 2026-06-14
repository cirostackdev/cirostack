"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, ChevronRight, Users, Search, Trash2, Loader2, X } from "lucide-react";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeletons";
import { toast } from "sonner";

type Client = { id: string; email: string; name?: string; company?: string; _count: { projects: number; invoices: number }; createdAt: string };

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", name: "", company: "" });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  // Single delete modal
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Multi-select & bulk delete
  const [tableSelected, setTableSelected] = useState<Set<string>>(new Set());
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/clients");
    if (res.ok) setClients(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/clients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { toast.success("Client created"); setOpen(false); setForm({ email: "", name: "", company: "" }); load(); }
    else { const { error } = await res.json(); toast.error(error ?? "Failed"); }
    setSaving(false);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/clients/${deleteTarget.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Client deleted");
      setClients((prev) => prev.filter((c) => c.id !== deleteTarget.id));
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
    await Promise.all(ids.map((id) => fetch(`/api/admin/clients/${id}`, { method: "DELETE" })));
    setClients((prev) => prev.filter((c) => !tableSelected.has(c.id)));
    setTableSelected(new Set());
    setShowBulkDelete(false);
    setBulkDeleting(false);
    toast.success(`${ids.length} client${ids.length !== 1 ? "s" : ""} deleted`);
  }

  function toggleTableRow(id: string) {
    setTableSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleTableAll() {
    const ids = filtered.map((c) => c.id);
    const allSelected = ids.length > 0 && ids.every((id) => tableSelected.has(id));
    setTableSelected(allSelected ? new Set() : new Set(ids));
  }

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.email.toLowerCase().includes(q) || (c.name ?? "").toLowerCase().includes(q) || (c.company ?? "").toLowerCase().includes(q);
  });

  return (
    <AdminShell title="Clients">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm text-muted-foreground shrink-0">
            {loading ? <span className="inline-block h-4 w-14 rounded bg-muted animate-pulse" /> : (
              <>
                {search ? <><span className="text-foreground font-medium">{filtered.length}</span> of </> : null}
                {clients.length} client{clients.length !== 1 ? "s" : ""}
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Client</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Client</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-2">
                <div className="space-y-1.5"><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required /></div>
                <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Company</Label><Input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} /></div>
                <Button type="submit" disabled={saving} className="w-full">{saving ? "Creating…" : "Create Client"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search email, name or company…"
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

      {loading ? <AdminTableSkeleton cols={6} /> : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-4 py-3 w-8">
                    <button onClick={toggleTableAll} className={`w-4 h-4 rounded border-2 flex items-center justify-center ${filtered.length > 0 && filtered.every((c) => tableSelected.has(c.id)) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                      {filtered.length > 0 && filtered.every((c) => tableSelected.has(c.id)) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Company</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Projects</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Invoices</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className={`border-t border-border hover:bg-muted/20 transition-colors ${tableSelected.has(c.id) ? "bg-primary/5" : ""}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleTableRow(c.id)} className={`w-4 h-4 rounded border-2 flex items-center justify-center ${tableSelected.has(c.id) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                        {tableSelected.has(c.id) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium"><a href={`mailto:${c.email}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">{c.email}</a></td>
                    <td className="px-4 py-3 text-muted-foreground">{c.name ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.company ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c._count.projects}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c._count.invoices}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/admin/clients/${c.id}`}>
                          <Button variant="ghost" size="icon" className="w-8 h-8"><ChevronRight className="w-4 h-4" /></Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(c)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">No clients found</p>
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
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${filtered.length > 0 && filtered.every((c) => tableSelected.has(c.id)) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                  {filtered.length > 0 && filtered.every((c) => tableSelected.has(c.id)) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                </div>
                {filtered.every((c) => tableSelected.has(c.id)) ? "Deselect All" : `Select All (${filtered.length})`}
              </button>
              {tableSelected.size > 0 && <span className="text-xs text-muted-foreground">{tableSelected.size} selected</span>}
            </div>
          )}

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">No clients found</p>
              </div>
            )}
            {filtered.map((c) => (
              <div key={c.id} className={`p-4 rounded-xl border ${tableSelected.has(c.id) ? "border-primary bg-primary/5" : "border-border"}`}>
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleTableRow(c.id)} className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${tableSelected.has(c.id) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                    {tableSelected.has(c.id) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                  </button>
                  <div className="min-w-0 flex-1">
                    <a href={`mailto:${c.email}`} target="_blank" rel="noopener noreferrer" className="font-medium text-sm truncate hover:text-blue-500 block">{c.email}</a>
                    <p className="text-xs text-muted-foreground mt-0.5">{[c.name, c.company].filter(Boolean).join(" · ") || "—"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c._count.projects} project{c._count.projects !== 1 ? "s" : ""} · {c._count.invoices} invoice{c._count.invoices !== 1 ? "s" : ""}</p>
                    <div className="flex items-center gap-2 mt-3 justify-end">
                      <Link href={`/admin/clients/${c.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 px-3 gap-1.5 text-xs">
                          <ChevronRight className="w-3.5 h-3.5" /> View
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="h-8 px-3 gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => setDeleteTarget(c)}>
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
                <h2 className="font-semibold">Delete client?</h2>
                <p className="text-sm text-muted-foreground mt-1">"{deleteTarget.email}"</p>
                <p className="text-xs text-muted-foreground mt-2">This client will be permanently deleted. This cannot be undone.</p>
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
                <h2 className="font-semibold">Delete {tableSelected.size} client{tableSelected.size !== 1 ? "s" : ""}?</h2>
                <p className="text-xs text-muted-foreground mt-2">All selected clients will be permanently deleted. This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowBulkDelete(false)} disabled={bulkDeleting}>Cancel</Button>
              <Button variant="destructive" size="sm" onClick={confirmBulkDelete} disabled={bulkDeleting}>
                {bulkDeleting ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Deleting…</> : `Delete ${tableSelected.size} Client${tableSelected.size !== 1 ? "s" : ""}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
