"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

type Invoice = {
  id: string; number: string; amount: number; currency: string; status: string;
  dueDate?: string; createdAt: string;
  client: { email: string; name?: string; company?: string };
  project?: { title: string };
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "default", unpaid: "secondary", overdue: "destructive", cancelled: "outline", partial: "outline",
};

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/invoices").then((r) => r.json()).then((d) => { setInvoices(d); setLoading(false); });
  }, []);

  const total = invoices.reduce((s, i) => s + i.amount, 0);
  const paid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);

  return (
    <AdminShell title="Invoices">
      <div className="p-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Total Invoiced</p>
            <p className="text-2xl font-bold mt-1">${(total / 100).toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Total Collected</p>
            <p className="text-2xl font-bold mt-1 text-green-600">${(paid / 100).toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-border p-4 flex items-center justify-end">
            <Link href="/admin/invoices/new">
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Invoice</Button>
            </Link>
          </div>
        </div>

        {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Invoice</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Due</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{inv.number}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inv.client.name ?? inv.client.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inv.project?.title ?? "—"}</td>
                    <td className="px-4 py-3 font-medium">{inv.currency} {(inv.amount / 100).toFixed(2)}</td>
                    <td className="px-4 py-3"><Badge variant={statusVariant[inv.status] ?? "secondary"}>{inv.status}</Badge></td>
                    <td className="px-4 py-3 text-muted-foreground">{inv.dueDate ? inv.dueDate.slice(0, 10) : "—"}</td>
                  </tr>
                ))}
                {invoices.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No invoices yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
