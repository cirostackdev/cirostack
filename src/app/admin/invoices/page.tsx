"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronRight, Send, CheckCircle, Trash2, Receipt } from "lucide-react";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeletons";
import { toast } from "sonner";

type Invoice = {
  id: string; number: string; amount: number; currency: string; usdRate: number; status: string;
  dueDate?: string; createdAt: string;
  client: { email: string; name?: string; company?: string };
  project?: { title: string };
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "default", unpaid: "secondary", overdue: "destructive", cancelled: "outline", partial: "outline",
};

function isOverdue(inv: Invoice) {
  return inv.status === "unpaid" && inv.dueDate && new Date(inv.dueDate) < new Date();
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/admin/invoices").then((r) => r.json()).then((data) => {
      setInvoices(data);
      setLoading(false);
    });
  }, []);

  async function handleMarkPaid(id: string) {
    const res = await fetch(`/api/admin/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid", paidAt: new Date().toISOString() }),
    });
    if (res.ok) {
      setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, status: "paid" } : inv));
      toast.success("Marked as paid");
    } else {
      toast.error("Failed");
    }
  }

  async function handleSend(id: string) {
    const res = await fetch(`/api/admin/invoices/${id}/send`, { method: "POST" });
    if (res.ok) toast.success("Invoice sent to client");
    else toast.error("Failed to send");
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this invoice?")) return;
    const res = await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
    if (res.ok) {
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      toast.success("Deleted");
    } else {
      toast.error("Failed to delete");
    }
  }

  // Derive effective status (flag overdue)
  const withEffectiveStatus = invoices.map((inv) => ({
    ...inv,
    effectiveStatus: isOverdue(inv) ? "overdue" : inv.status,
  }));

  const filtered = filter === "all" ? withEffectiveStatus : withEffectiveStatus.filter((inv) => inv.effectiveStatus === filter);

  // Sum all invoices in USD using the stored exchange rate at time of creation
  const totalUsd = invoices.reduce((s, i) => s + (i.amount / 100) * (i.usdRate ?? 1), 0);
  const paidUsd = invoices.filter(i => i.status === "paid").reduce((s, i) => s + (i.amount / 100) * (i.usdRate ?? 1), 0);
  const fmtUsd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const FILTERS = ["all", "unpaid", "overdue", "paid", "cancelled"];

  return (
    <AdminShell title="Invoices">
      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Total Invoiced</p>
          {loading
            ? <div className="h-8 w-32 bg-muted rounded animate-pulse mt-1" />
            : <p className="text-2xl font-bold mt-1">{fmtUsd(totalUsd)}</p>}
          <p className="text-xs text-muted-foreground mt-0.5">USD equivalent at invoice date</p>
        </div>
        <div className="flex-1 rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Total Collected</p>
          {loading
            ? <div className="h-8 w-28 bg-muted rounded animate-pulse mt-1" />
            : <p className="text-2xl font-bold mt-1 text-green-600">{fmtUsd(paidUsd)}</p>}
          <p className="text-xs text-muted-foreground mt-0.5">USD equivalent at invoice date</p>
        </div>
        <div className="sm:self-center">
          <Link href="/admin/invoices/new">
            <Button size="sm" className="w-full sm:w-auto"><Plus className="w-4 h-4 mr-1" /> New Invoice</Button>
          </Link>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
            {f !== "all" && (
              <span className="ml-1.5 opacity-60">({withEffectiveStatus.filter((i) => i.effectiveStatus === f).length})</span>
            )}
          </button>
        ))}
      </div>

      {loading ? <AdminTableSkeleton cols={6} /> : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Invoice</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Due</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr key={inv.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/invoices/${inv.id}`} className="font-medium hover:underline">{inv.number}</Link>
                      {inv.project && <p className="text-xs text-muted-foreground">{inv.project.title}</p>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{inv.client.name ?? inv.client.email}</td>
                    <td className="px-4 py-3 font-medium">
                      <span>{inv.currency} {(inv.amount / 100).toFixed(2)}</span>
                      {inv.currency !== "USD" && inv.usdRate && (
                        <p className="text-xs text-muted-foreground">≈ ${((inv.amount / 100) * inv.usdRate).toFixed(2)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3"><Badge variant={statusVariant[inv.effectiveStatus] ?? "secondary"}>{inv.effectiveStatus}</Badge></td>
                    <td className="px-4 py-3 text-muted-foreground">{inv.dueDate ? inv.dueDate.slice(0, 10) : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {inv.effectiveStatus !== "paid" && (
                          <Button variant="ghost" size="icon" className="w-7 h-7" title="Mark paid" onClick={() => handleMarkPaid(inv.id)}>
                            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="w-7 h-7" title="Send to client" onClick={() => handleSend(inv.id)}>
                          <Send className="w-3.5 h-3.5" />
                        </Button>
                        <Link href={`/admin/invoices/${inv.id}`}>
                          <Button variant="ghost" size="icon" className="w-7 h-7"><ChevronRight className="w-4 h-4" /></Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive" onClick={() => handleDelete(inv.id)}>
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
                          <Receipt className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">No invoices found</p>
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
                  <Receipt className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">No invoices found</p>
              </div>
            )}
            {filtered.map((inv) => (
              <div key={inv.id} className="p-4 rounded-xl border border-border">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={`/admin/invoices/${inv.id}`} className="font-medium text-sm hover:underline">{inv.number}</Link>
                    <p className="text-xs text-muted-foreground mt-0.5">{inv.client.name ?? inv.client.email}</p>
                    {inv.project && <p className="text-xs text-muted-foreground">{inv.project.title}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <p className="font-semibold text-sm">{inv.currency} {(inv.amount / 100).toFixed(2)}</p>
                    {inv.currency !== "USD" && inv.usdRate && (
                      <p className="text-xs text-muted-foreground">≈ ${((inv.amount / 100) * inv.usdRate).toFixed(2)}</p>
                    )}
                    <Badge variant={statusVariant[inv.effectiveStatus] ?? "secondary"}>{inv.effectiveStatus}</Badge>
                  </div>
                </div>
                {inv.dueDate && <p className="text-xs text-muted-foreground mt-2">Due {inv.dueDate.slice(0, 10)}</p>}
                <div className="flex items-center gap-1 mt-3 justify-end">
                  {inv.effectiveStatus !== "paid" && (
                    <Button variant="ghost" size="sm" className="h-9 px-2.5 gap-1.5 text-xs" onClick={() => handleMarkPaid(inv.id)}>
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" /> Mark Paid
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="h-9 px-2.5 gap-1.5 text-xs" onClick={() => handleSend(inv.id)}>
                    <Send className="w-3.5 h-3.5" /> Send
                  </Button>
                  <Button variant="ghost" size="sm" className="h-9 px-2.5 gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => handleDelete(inv.id)}>
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminShell>
  );
}
