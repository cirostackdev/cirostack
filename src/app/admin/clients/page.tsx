"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, ChevronRight, Users } from "lucide-react";
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

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.email.toLowerCase().includes(q) || (c.name ?? "").toLowerCase().includes(q) || (c.company ?? "").toLowerCase().includes(q);
  });

  return (
    <AdminShell title="Clients">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <p className="text-sm text-muted-foreground shrink-0">{loading ? <span className="inline-block h-4 w-14 rounded bg-muted animate-pulse" /> : <>{clients.length} clients</>}</p>
          <Input
            placeholder="Search email, name or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-sm w-full sm:w-64"
          />
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

        {loading ? <AdminTableSkeleton cols={6} /> : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
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
                    <tr key={c.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium"><a href={`mailto:${c.email}`} className="hover:text-blue-500">{c.email}</a></td>
                      <td className="px-4 py-3 text-muted-foreground">{c.name ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.company ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c._count.projects}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c._count.invoices}</td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/clients/${c.id}`}>
                          <Button variant="ghost" size="icon" className="w-8 h-8"><ChevronRight className="w-4 h-4" /></Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center">
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
                <Link key={c.id} href={`/admin/clients/${c.id}`} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                  <div className="min-w-0">
                    <a href={`mailto:${c.email}`} onClick={(e) => e.stopPropagation()} className="font-medium text-sm truncate hover:text-blue-500 block">{c.email}</a>
                    <p className="text-xs text-muted-foreground mt-0.5">{[c.name, c.company].filter(Boolean).join(" · ") || "—"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c._count.projects} project{c._count.projects !== 1 ? "s" : ""} · {c._count.invoices} invoice{c._count.invoices !== 1 ? "s" : ""}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 ml-3" />
                </Link>
              ))}
            </div>
          </>
        )}
    </AdminShell>
  );
}
