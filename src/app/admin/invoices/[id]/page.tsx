"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDetailSkeleton } from "@/components/admin/AdminSkeletons";
import { format } from "date-fns";
import { fmtMoney } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Send, Trash2, CheckCircle, Pencil, X } from "lucide-react";
import { INVOICE_BADGE_VARIANT, INVOICE_STATUS_COLORS } from "@/lib/colors";

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
  lineItems: { description: string; amount: number; qty?: number; unitPrice?: number }[];
  client: { id: string; email: string; name?: string; company?: string };
  project?: { id: string; title: string };
};

const statusVariant = INVOICE_BADGE_VARIANT;

export default function AdminInvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editNumber, setEditNumber] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  async function load() {
    const res = await fetch(`/api/admin/invoices/${id}`);
    if (res.ok) {
      const data = await res.json();
      setInvoice(data);
      setStatus(data.status);
      setEditNumber(data.number);
      setEditDueDate(data.dueDate ? data.dueDate.slice(0, 10) : "");
      setEditStatus(data.status);
    }
  }
  useEffect(() => { load(); }, [id]);

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    setEditSaving(true);
    const res = await fetch(`/api/admin/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number: editNumber,
        dueDate: editDueDate || null,
        status: editStatus,
        ...(editStatus === "paid" && invoice?.status !== "paid" ? { paidAt: new Date().toISOString() } : {}),
      }),
    });
    if (res.ok) {
      toast.success("Invoice updated");
      setEditOpen(false);
      load();
    } else {
      toast.error("Failed to update invoice");
    }
    setEditSaving(false);
  }

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
            <Button size="sm" variant="outline" onClick={() => setEditOpen((v) => !v)}>
              {editOpen ? <><X className="w-4 h-4 mr-1" /> Cancel</> : <><Pencil className="w-4 h-4 mr-1" /> Edit</>}
            </Button>
          </div>
        </div>

        {/* Meta */}
        <div className="rounded-xl border border-border p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Client</p>
              <Link href={`/admin/clients/${invoice.client.id}`} className="font-medium hover:underline">{invoice.client.name ?? invoice.client.email}</Link>
              {invoice.client.company && <p className="text-xs text-muted-foreground">{invoice.client.company}</p>}
              <a href={`mailto:${invoice.client.email}`} className="text-xs text-muted-foreground hover:text-blue-500 block">{invoice.client.email}</a>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Amount</p>
              <p className="text-xl font-bold">{fmtMoney(invoice.amount, invoice.currency)}</p>
              <span className={`inline-block w-[76px] text-center text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${INVOICE_STATUS_COLORS[status] ?? "bg-muted text-muted-foreground"}`}>{status}</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Dates</p>
              <p className="text-xs">Created {format(new Date(invoice.createdAt), "MMM d, yyyy")}</p>
              {invoice.dueDate && <p className="text-xs">Due {format(new Date(invoice.dueDate), "MMM d, yyyy")}</p>}
              {invoice.paidAt && <p className="text-xs text-green-500 font-medium">Paid {format(new Date(invoice.paidAt), "MMM d, yyyy")}</p>}
              {invoice.paymentRef && <p className="text-xs text-muted-foreground">Ref: {invoice.paymentRef}</p>}
            </div>
          </div>
        </div>

        {/* Inline edit form */}
        {editOpen && (
          <form onSubmit={handleSaveEdit} className="rounded-xl border border-border p-5 space-y-4 bg-muted/10">
            <p className="text-sm font-semibold">Edit Invoice</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Invoice Number</Label>
                <Input value={editNumber} onChange={(e) => setEditNumber(e.target.value)} required className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Due Date</Label>
                <Input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={editSaving}>{editSaving ? "Saving..." : "Save Changes"}</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            </div>
          </form>
        )}

        {/* Line items */}
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Description</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((l, i) => {
                // Support both old format (qty * unitPrice) and new format (amount)
                const amt = l.amount != null
                  ? l.amount
                  : ((l.qty ?? 1) * (l.unitPrice ?? 0));
                return (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-3">{l.description}</td>
                    <td className="px-4 py-3 text-right font-medium">{fmtMoney(amt, invoice.currency)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t-2 border-border bg-muted/20">
              <tr>
                <td className="px-4 py-3 text-right font-semibold">Total</td>
                <td className="px-4 py-3 text-right font-bold">{fmtMoney(invoice.amount, invoice.currency)}</td>
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
