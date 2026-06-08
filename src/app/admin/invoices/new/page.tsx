"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type Client = { id: string; email: string; name?: string; projects: { id: string; title: string }[] };
type LineItem = { description: string; amount: string };

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [number, setNumber] = useState(`INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`);
  const [dueDate, setDueDate] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: "", amount: "" }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/clients").then((r) => r.json()).then(async (cs: Client[]) => {
      // Load projects for each client
      const enriched = await Promise.all(
        cs.map(async (c) => {
          const res = await fetch(`/api/admin/clients/${c.id}`);
          if (res.ok) { const d = await res.json(); return { ...c, projects: d.projects ?? [] }; }
          return { ...c, projects: [] };
        })
      );
      setClients(enriched);
    });
  }, []);

  const selectedClient = clients.find((c) => c.id === clientId);
  const total = lineItems.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);

  function updateLine(i: number, key: keyof LineItem, val: string) {
    setLineItems((prev) => prev.map((l, idx) => idx === i ? { ...l, [key]: val } : l));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || !number) return;
    setSaving(true);
    const res = await fetch("/api/admin/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        projectId: projectId || null,
        number,
        amount: Math.round(total * 100),
        currency,
        dueDate: dueDate || null,
        lineItems: lineItems.map((l) => ({ description: l.description, amount: Math.round((parseFloat(l.amount) || 0) * 100) })),
      }),
    });
    if (res.ok) { toast.success("Invoice created"); router.push("/admin/invoices"); }
    else { const { error } = await res.json(); toast.error(error ?? "Failed"); }
    setSaving(false);
  }

  return (
    <AdminShell title="New Invoice">
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Client *</Label>
            <Select value={clientId} onValueChange={(v) => { setClientId(v); setProjectId(""); }}>
              <SelectTrigger><SelectValue placeholder="Select client…" /></SelectTrigger>
              <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name ?? c.email}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Project (optional)</Label>
            <Select value={projectId} onValueChange={setProjectId} disabled={!selectedClient}>
              <SelectTrigger><SelectValue placeholder="Select project…" /></SelectTrigger>
              <SelectContent>{(selectedClient?.projects ?? []).map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Invoice Number *</Label><Input value={number} onChange={(e) => setNumber(e.target.value)} required /></div>
          <div className="space-y-1.5"><Label>Due Date</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
        </div>

        {/* Line items */}
        <div className="space-y-2">
          <Label>Line Items</Label>
          {lineItems.map((l, i) => (
            <div key={i} className="grid grid-cols-[1fr_140px_36px] gap-2 items-center">
              <Input
                placeholder="Description (e.g. Frontend Development — Phase 1)"
                value={l.description}
                onChange={(e) => updateLine(i, "description", e.target.value)}
              />
              <Input
                inputMode="decimal"
                placeholder="Amount"
                value={l.amount}
                onChange={(e) => updateLine(i, "amount", e.target.value)}
                onBlur={(e) => { const n = parseFloat(e.target.value); updateLine(i, "amount", isNaN(n) ? "" : String(n)); }}
                className="text-right"
              />
              <Button type="button" variant="ghost" size="icon" className="w-9 h-9 text-destructive" onClick={() => setLineItems((p) => p.filter((_, idx) => idx !== i))} disabled={lineItems.length === 1}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1">
            <Button type="button" variant="outline" size="sm" onClick={() => setLineItems((p) => [...p, { description: "", amount: "" }])}>
              <Plus className="w-4 h-4 mr-1" /> Add Line Item
            </Button>
            <div className="text-sm font-semibold">USD {total.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving || !clientId}>{saving ? "Creating…" : "Create Invoice"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </AdminShell>
  );
}
