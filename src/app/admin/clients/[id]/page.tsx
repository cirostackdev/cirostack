"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDetailSkeleton } from "@/components/admin/AdminSkeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, Plus } from "lucide-react";

type Client = { id: string; email: string; name?: string; company?: string; projects: Project[]; invoices: Invoice[] };
type Project = { id: string; title: string; status: string; _count: { updates: number; files: number } };
type Invoice = { id: string; number: string; amount: number; currency: string; status: string };

const statusColors: Record<string, string> = {
  discovery: "bg-blue-100 text-blue-700",
  proposal: "bg-yellow-100 text-yellow-700",
  active: "bg-green-100 text-green-700",
  review: "bg-purple-100 text-purple-700",
  complete: "bg-gray-100 text-gray-700",
  paused: "bg-orange-100 text-orange-700",
};

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [projectOpen, setProjectOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: "", description: "", status: "discovery" });
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch(`/api/admin/clients/${id}`);
    if (res.ok) setClient(await res.json());
  }
  useEffect(() => { load(); }, [id]);

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: id, ...projectForm }),
    });
    if (res.ok) { toast.success("Project created"); setProjectOpen(false); load(); }
    else { const { error } = await res.json(); toast.error(error ?? "Failed"); }
    setSaving(false);
  }

  if (!client) return <AdminShell title="Client"><AdminDetailSkeleton /></AdminShell>;

  return (
    <AdminShell title={client.name ?? client.email}>
      <div className="max-w-4xl space-y-8">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Client info */}
        <div className="rounded-xl border border-border p-5 space-y-2">
          <h2 className="font-semibold">Client Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div><p className="text-muted-foreground">Email</p><p className="break-all">{client.email}</p></div>
            <div><p className="text-muted-foreground">Name</p><p>{client.name ?? "—"}</p></div>
            <div><p className="text-muted-foreground">Company</p><p>{client.company ?? "—"}</p></div>
          </div>
        </div>

        {/* Projects */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Projects</h2>
            <Dialog open={projectOpen} onOpenChange={setProjectOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Project</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Project</DialogTitle></DialogHeader>
                <form onSubmit={handleCreateProject} className="space-y-4 mt-2">
                  <div className="space-y-1.5"><Label>Title *</Label><Input value={projectForm.title} onChange={(e) => setProjectForm((f) => ({ ...f, title: e.target.value }))} required /></div>
                  <div className="space-y-1.5"><Label>Description</Label><Textarea value={projectForm.description} onChange={(e) => setProjectForm((f) => ({ ...f, description: e.target.value }))} rows={2} /></div>
                  <Button type="submit" disabled={saving} className="w-full">{saving ? "Creating…" : "Create Project"}</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-2">
            {client.projects.map((p) => (
              <Link key={p.id} href={`/admin/projects/${p.id}`} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p._count.updates} updates · {p._count.files} files</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[p.status] ?? "bg-gray-100 text-gray-700"}`}>{p.status}</span>
              </Link>
            ))}
            {client.projects.length === 0 && <p className="text-sm text-muted-foreground">No projects yet.</p>}
          </div>
        </div>

        {/* Invoices */}
        <div>
          <h2 className="font-semibold mb-3">Invoices</h2>
          <div className="space-y-2">
            {client.invoices.map((inv) => (
              <Link key={inv.id} href={`/admin/invoices`} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                <p className="font-medium">{inv.number}</p>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{inv.currency} {(inv.amount / 100).toFixed(2)}</span>
                  <Badge variant={inv.status === "paid" ? "default" : "secondary"}>{inv.status}</Badge>
                </div>
              </Link>
            ))}
            {client.invoices.length === 0 && <p className="text-sm text-muted-foreground">No invoices yet.</p>}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
