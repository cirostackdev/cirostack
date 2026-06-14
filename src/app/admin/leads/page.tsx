"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Mail, Tag, Plus, Pencil, Trash2, Download, X, Users, ChevronRight, UserPlus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeletons";
import { InlineStatusSelect } from "@/components/admin/InlineStatusSelect";
import { LEAD_STATUS_COLORS as LEAD_COLORS, SUBMISSION_TYPE_COLORS } from "@/lib/colors";

type Lead = {
  id: string;
  email: string;
  name: string | null;
  source: string | null;
  tags: string[];
  createdAt: string;
};

const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost"];
const LEAD_STATUS_COLORS = LEAD_COLORS;

function getLeadStatus(tags: string[]): string {
  return LEAD_STATUSES.find((s) => tags.includes(s)) ?? "new";
}

function nextLeadStatus(current: string): string {
  if (current === "qualified") return "won";
  const idx = LEAD_STATUSES.indexOf(current);
  return idx >= 0 && idx < LEAD_STATUSES.length - 1 ? LEAD_STATUSES[idx + 1] : "new";
}

function exportCsv(leads: Lead[]) {
  const header = "Email,Name,Source,Tags,Added";
  const rows = leads.map((l) =>
    [l.email, l.name ?? "", l.source ?? "", l.tags.join(";"), format(new Date(l.createdAt), "yyyy-MM-dd")].map((v) => `"${v}"`).join(",")
  );
  const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [filterTag, setFilterTag] = useState("");

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ email: "", name: "", source: "", tags: "" });
  const [creating, setCreating] = useState(false);

  // Edit dialog
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState({ name: "", source: "", tags: "" });
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);

  // Single delete modal
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Multi-select & bulk delete
  const [tableSelected, setTableSelected] = useState<Set<string>>(new Set());
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/leads");
    if (res.ok) setLeads(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...createForm,
        tags: createForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    if (res.ok) {
      toast.success("Lead created");
      setCreateOpen(false);
      setCreateForm({ email: "", name: "", source: "", tags: "" });
      load();
    } else {
      const { error } = await res.json();
      toast.error(error ?? "Failed");
    }
    setCreating(false);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editLead) return;
    setSaving(true);
    const res = await fetch(`/api/admin/leads/${editLead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.name || null,
        source: editForm.source || null,
        tags: editForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    if (res.ok) {
      toast.success("Lead updated");
      setEditLead(null);
      load();
    } else {
      toast.error("Failed to update");
    }
    setSaving(false);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/leads/${deleteTarget.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Lead deleted");
      setLeads((prev) => prev.filter((l) => l.id !== deleteTarget.id));
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
    await Promise.all(ids.map((id) => fetch(`/api/admin/leads/${id}`, { method: "DELETE" })));
    setLeads((prev) => prev.filter((l) => !tableSelected.has(l.id)));
    setTableSelected(new Set());
    setShowBulkDelete(false);
    setBulkDeleting(false);
    toast.success(`${ids.length} lead${ids.length !== 1 ? "s" : ""} deleted`);
  }

  async function handleConvertToClient(lead: Lead) {
    setConverting(true);
    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: lead.email, name: lead.name }),
    });
    if (res.status === 409) {
      toast.info("Client with this email already exists");
    } else if (res.ok) {
      const wonTags = lead.tags.filter((t) => !LEAD_STATUSES.includes(t)).concat("won");
      await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: wonTags }),
      });
      toast.success("Lead converted to client");
      setEditLead(null);
      load();
    } else {
      toast.error("Failed to convert lead");
    }
    setConverting(false);
  }

  async function handleCycleStatus(lead: Lead) {
    const current = getLeadStatus(lead.tags);
    const next = nextLeadStatus(current);
    const newTags = lead.tags.filter((t) => !LEAD_STATUSES.includes(t)).concat(next);
    const res = await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags: newTags }),
    });
    if (res.ok) {
      setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, tags: newTags } : l));
      toast.success(`Status updated to ${next}`);
    } else {
      toast.error("Failed to update status");
    }
  }

  function toggleTableRow(id: string) {
    setTableSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleTableAll() {
    const ids = filtered.map((l) => l.id);
    const allSelected = ids.length > 0 && ids.every((id) => tableSelected.has(id));
    setTableSelected(allSelected ? new Set() : new Set(ids));
  }

  const allSources = Array.from(new Set(leads.map((l) => l.source).filter(Boolean))) as string[];
  const allTags = Array.from(new Set(leads.flatMap((l) => l.tags)));

  const sourceColorMap = Object.fromEntries(
    [""].concat(allSources).map((s) => [s, s === "" ? "bg-muted text-muted-foreground" : (SUBMISSION_TYPE_COLORS[s] ?? "bg-muted text-muted-foreground")])
  );
  const tagColorMap = Object.fromEntries(
    [""].concat(allTags).map((t) => [t, t === "" ? "bg-muted text-muted-foreground" : (LEAD_COLORS[t] ?? "bg-muted text-muted-foreground")])
  );

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.email.toLowerCase().includes(q) || (l.name ?? "").toLowerCase().includes(q) || (l.source ?? "").toLowerCase().includes(q);
    const matchSource = !filterSource || l.source === filterSource;
    const matchTag = !filterTag || l.tags.includes(filterTag);
    return matchSearch && matchSource && matchTag;
  });

  return (
    <AdminShell title="Leads">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm text-muted-foreground shrink-0">
            {loading ? <span className="inline-block h-4 w-14 rounded bg-muted animate-pulse" /> : (
              <>
                {(search || filterSource || filterTag) ? <><span className="text-foreground font-medium">{filtered.length}</span> of </> : null}
                {leads.length} total lead{leads.length !== 1 ? "s" : ""}
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
        <div className="flex gap-2 shrink-0 sm:ml-auto">
          <Button variant="outline" size="sm" onClick={() => exportCsv(filtered)}>
            <Download className="w-4 h-4 mr-1" /> Export CSV
          </Button>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Lead</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Lead</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-2">
                <div className="space-y-1.5"><Label>Email *</Label><Input type="email" value={createForm.email} onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))} required /></div>
                <div className="space-y-1.5"><Label>Name</Label><Input value={createForm.name} onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Source</Label><Input value={createForm.source} placeholder="e.g. website, referral" onChange={(e) => setCreateForm((f) => ({ ...f, source: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Tags <span className="text-muted-foreground text-xs">(comma-separated)</span></Label><Input value={createForm.tags} placeholder="newsletter, warm, demo" onChange={(e) => setCreateForm((f) => ({ ...f, tags: e.target.value }))} /></div>
                <Button type="submit" disabled={creating} className="w-full">{creating ? "Creating…" : "Add Lead"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search email, name or source…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {allSources.length > 0 && (
            <InlineStatusSelect
              id="source-filter"
              value={filterSource || "All sources"}
              options={["All sources"].concat(allSources)}
              colorMap={sourceColorMap}
              onChange={(_, val) => setFilterSource(val === "All sources" ? "" : val)}
              dynamicWidth
            />
          )}
          {allTags.length > 0 && (
            <InlineStatusSelect
              id="tag-filter"
              value={filterTag || "All tags"}
              options={["All tags"].concat(allTags)}
              colorMap={tagColorMap}
              onChange={(_, val) => setFilterTag(val === "All tags" ? "" : val)}
              dynamicWidth
            />
          )}
          {(search || filterSource || filterTag) && (
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => { setSearch(""); setFilterSource(""); setFilterTag(""); }}>
              <X className="w-3 h-3 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editLead} onOpenChange={(o) => !o && setEditLead(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Lead — {editLead?.email}</DialogTitle></DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4 mt-2">
            <div className="space-y-1.5"><Label>Name</Label><Input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label>Source</Label><Input value={editForm.source} onChange={(e) => setEditForm((f) => ({ ...f, source: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label>Tags <span className="text-muted-foreground text-xs">(comma-separated)</span></Label><Input value={editForm.tags} onChange={(e) => setEditForm((f) => ({ ...f, tags: e.target.value }))} /></div>
            <Button type="submit" disabled={saving} className="w-full">{saving ? "Saving…" : "Save Changes"}</Button>
          </form>
          <div className="border-t border-border pt-4 mt-2">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              disabled={converting}
              onClick={() => editLead && handleConvertToClient(editLead)}
            >
              <UserPlus className="w-4 h-4" />
              {converting ? "Converting…" : "Convert to Client"}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">Creates a client account and marks lead as Won</p>
          </div>
        </DialogContent>
      </Dialog>

      {loading ? <AdminTableSkeleton cols={5} /> : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 w-8">
                    <button onClick={toggleTableAll} className={`w-4 h-4 rounded border-2 flex items-center justify-center ${filtered.length > 0 && filtered.every((l) => tableSelected.has(l.id)) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                      {filtered.length > 0 && filtered.every((l) => tableSelected.has(l.id)) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                    </button>
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Email</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Name</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Source</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Tags</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Added</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">No leads found</p>
                        <p className="text-xs text-muted-foreground/70">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
                {filtered.map((lead, i) => {
                  const leadStatus = getLeadStatus(lead.tags);
                  return (
                    <tr key={lead.id} className={`border-b border-border last:border-0 transition-colors ${tableSelected.has(lead.id) ? "bg-primary/5" : i % 2 === 0 ? "" : "bg-muted/20"}`}>
                      <td className="px-4 py-2.5">
                        <button onClick={() => toggleTableRow(lead.id)} className={`w-4 h-4 rounded border-2 flex items-center justify-center ${tableSelected.has(lead.id) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                          {tableSelected.has(lead.id) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                        </button>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <a href={`mailto:${lead.email}`} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-blue-500">{lead.email}</a>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">{lead.name || "—"}</td>
                      <td className="px-4 py-2.5">
                        <button
                          onClick={() => handleCycleStatus(lead)}
                          title="Click to advance status"
                          className={`inline-flex items-center justify-center w-[96px] text-xs px-2 py-0.5 rounded-full font-semibold capitalize hover:opacity-80 transition-opacity ${LEAD_STATUS_COLORS[leadStatus] ?? "bg-muted text-muted-foreground"}`}
                        >
                          {leadStatus}
                          <ChevronRight className="w-2.5 h-2.5 opacity-60" />
                        </button>
                      </td>
                      <td className="px-4 py-2.5">
                        {lead.source ? <span className="text-xs px-2 py-0.5 bg-muted rounded-full capitalize whitespace-nowrap">{lead.source}</span> : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {lead.tags.filter((t) => !LEAD_STATUSES.includes(t)).length > 0
                            ? lead.tags.filter((t) => !LEAD_STATUSES.includes(t)).map((tag) => (
                            <span key={tag} className="flex items-center gap-1 text-xs px-1.5 py-0.5 bg-blue-500/15 text-blue-500 rounded">
                              <Tag className="w-2.5 h-2.5" />{tag}
                            </span>
                          )) : <span className="text-muted-foreground text-xs">—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground text-xs whitespace-nowrap">{format(new Date(lead.createdAt), "MMM d, yyyy")}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1 justify-end">
                          <Button variant="ghost" size="icon" className="w-7 h-7 text-emerald-500 hover:text-emerald-500" title="Convert to client" onClick={() => handleConvertToClient(lead)}>
                            <UserPlus className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => { setEditLead(lead); setEditForm({ name: lead.name ?? "", source: lead.source ?? "", tags: lead.tags.filter((t) => !LEAD_STATUSES.includes(t)).join(", ") }); }}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(lead)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile select all */}
          {filtered.length > 0 && (
            <div className="md:hidden flex items-center justify-between px-1 py-2 mb-1">
              <button onClick={toggleTableAll} className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${filtered.length > 0 && filtered.every((l) => tableSelected.has(l.id)) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                  {filtered.length > 0 && filtered.every((l) => tableSelected.has(l.id)) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                </div>
                {filtered.every((l) => tableSelected.has(l.id)) ? "Deselect All" : `Select All (${filtered.length})`}
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
                <p className="text-sm font-medium text-foreground">No leads found</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters.</p>
              </div>
            )}
            {filtered.map((lead) => {
              const leadStatus = getLeadStatus(lead.tags);
              return (
                <div key={lead.id} className={`p-4 rounded-xl border ${tableSelected.has(lead.id) ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleTableRow(lead.id)} className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${tableSelected.has(lead.id) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                      {tableSelected.has(lead.id) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <a href={`mailto:${lead.email}`} target="_blank" rel="noopener noreferrer" className="font-medium text-sm truncate hover:text-blue-500">{lead.email}</a>
                          </div>
                          {lead.name && <p className="text-xs text-muted-foreground mt-0.5">{lead.name}</p>}
                        </div>
                        <p className="text-xs text-muted-foreground shrink-0">{format(new Date(lead.createdAt), "MMM d, yyyy")}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <button
                          onClick={() => handleCycleStatus(lead)}
                          className={`inline-flex items-center justify-center w-[96px] text-xs px-2 py-0.5 rounded-full font-semibold capitalize hover:opacity-80 transition-opacity ${LEAD_STATUS_COLORS[leadStatus] ?? "bg-muted text-muted-foreground"}`}
                        >
                          {leadStatus}
                          <ChevronRight className="w-2.5 h-2.5 opacity-60" />
                        </button>
                        {lead.source && <span className="text-xs px-2 py-0.5 bg-muted rounded-full capitalize whitespace-nowrap">{lead.source}</span>}
                        {lead.tags.filter((t) => !LEAD_STATUSES.includes(t)).map((tag) => (
                          <span key={tag} className="flex items-center gap-1 text-xs px-1.5 py-0.5 bg-blue-500/15 text-blue-500 rounded">
                            <Tag className="w-2.5 h-2.5" />{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 mt-3 justify-end">
                        <Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs" onClick={() => { setEditLead(lead); setEditForm({ name: lead.name ?? "", source: lead.source ?? "", tags: lead.tags.filter((t) => !LEAD_STATUSES.includes(t)).join(", ") }); }}>
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => setDeleteTarget(lead)}>
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
                <h2 className="font-semibold">Delete lead?</h2>
                <p className="text-sm text-muted-foreground mt-1">"{deleteTarget.email}"</p>
                <p className="text-xs text-muted-foreground mt-2">This lead will be permanently deleted.</p>
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
                <h2 className="font-semibold">Delete {tableSelected.size} lead{tableSelected.size !== 1 ? "s" : ""}?</h2>
                <p className="text-xs text-muted-foreground mt-2">All selected leads will be permanently deleted. This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowBulkDelete(false)} disabled={bulkDeleting}>Cancel</Button>
              <Button variant="destructive" size="sm" onClick={confirmBulkDelete} disabled={bulkDeleting}>
                {bulkDeleting ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Deleting…</> : `Delete ${tableSelected.size} Lead${tableSelected.size !== 1 ? "s" : ""}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
