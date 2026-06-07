"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDetailSkeleton } from "@/components/admin/AdminSkeletons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Send, Trash2, CheckCircle } from "lucide-react";

type Invoice = {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string | null;
  paidAt: string | null;
  paymentRef: string | null;
  createdAt: string;
  lineItems: { description: string; qty: number; unitPrice: number }[];
  client: { id: string; email: string; name?: string; company?: string };
  project?: { id: string; title: string };
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "default", unpaid: "secondary", overdue: "destructive", cancelled: "outline", partial: "outline",
};

export default function AdminInvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const res = await fetch(`/api/admin/invoices/${id}`);
    if (res.ok) {
      const data = await res.json();
      setInvoice(data);
      setStatus(data.status);
    }
  }
  useEffect(() => { load(); }, [id]);

  async function handleStatusChange(s: string) {
    setSaving(true);
    const body: Record<string, unknown> = { status: s };
    if (s === "paid" && invoice?.status !== "paid") {
      body.paidAt = new Date().toISOString();
    }
    const res = await fetch(`/api/admin/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setStatus(s);
      toast.success("Status updated");
      load();
    } else {
      toast.error("Failed to update status");
    }
    setSaving(false);
  }

  async function handleMarkPaid() {
    await handleStatusChange("paid");
  }

  async function handleSend() {
    setSending(true);
    const res = await fetch(`/api/admin/invoices/${id}/send`, { method: "POST" });
    if (res.ok) toast.success("Invoice sent to client");
    else toast.error("Failed to send invoice");
    setSending(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this invoice? This cannot be undone.")) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Invoice deleted");
      router.push("/admin/invoices");
    } else {
      toast.error("Failed to delete");
      setDeleting(false);
    }
  }

  if (!invoice) return <AdminShell title="Invoice"><AdminDetailSkeleton /></AdminShell>;

  return (
    <AdminShell title={invoice.number}>
      <div className="max-w-3xl space-y-6">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">{invoice.number}</h2>
            {invoice.project && (
              <Link href={`/admin/projects/${invoice.project.id}`} className="text-sm text-muted-foreground hover:text-foreground">
                {invoice.project.title}
              </Link>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={status} onValueChange={handleStatusChange} disabled={saving}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            {status !== "paid" && (
              <Button size="sm" onClick={handleMarkPaid} disabled={saving}>
                <CheckCircle className="w-4 h-4 mr-1" /> Mark Paid
              </Button>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="rounded-xl border border-border p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Client</p>
              <Link href={`/admin/clients/${invoice.client.id}`} className="font-medium hover:underline">{invoice.client.name ?? invoice.client.email}</Link>
              {invoice.client.company && <p className="text-xs text-muted-foreground">{invoice.client.company}</p>}
              <p className="text-xs text-muted-foreground">{invoice.client.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Amount</p>
              <p className="text-xl font-bold">{invoice.currency} {(invoice.amount / 100).toFixed(2)}</p>
              <Badge variant={statusVariant[status] ?? "secondary"} className="mt-1">{status}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Dates</p>
              <p className="text-xs">Created {new Date(invoice.createdAt).toLocaleDateString()}</p>
              {invoice.dueDate && <p className="text-xs">Due {new Date(invoice.dueDate).toLocaleDateString()}</p>}
              {invoice.paidAt && <p className="text-xs text-green-600 font-medium">Paid {new Date(invoice.paidAt).toLocaleDateString()}</p>}
              {invoice.paymentRef && <p className="text-xs text-muted-foreground">Ref: {invoice.paymentRef}</p>}
            </div>
          </div>
        </div>

        {/* Line items — scrollable on mobile */}
        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Description</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Qty</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Unit</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((l, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-3">{l.description}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{l.qty}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{invoice.currency} {(l.unitPrice / 100).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-medium">{invoice.currency} {((l.qty * l.unitPrice) / 100).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-border bg-muted/20">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-right font-semibold">Total</td>
                <td className="px-4 py-3 text-right font-bold">{invoice.currency} {(invoice.amount / 100).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleSend} disabled={sending}>
            <Send className="w-4 h-4 mr-1" />{sending ? "Sending…" : "Email to Client"}
          </Button>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="w-4 h-4 mr-1" />{deleting ? "Deleting…" : "Delete Invoice"}
          </Button>
        </div>
      </div>
    </AdminShell>
  );
}
