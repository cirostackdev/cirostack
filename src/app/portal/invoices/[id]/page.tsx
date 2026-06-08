import { clientAuth } from "@/auth-client";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PayButton from "./PayButton";
import DownloadPdfButton from "./DownloadPdfButton";
import { PortalShell } from "@/components/portal/PortalShell";
import { fmtMoney } from "@/lib/format";
import { INVOICE_STATUS_COLORS } from "@/lib/colors";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await clientAuth();
  if (!session?.user) redirect("/portal/login");
  const clientId = (session.user as any).id as string;
  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: { id, clientId },
    include: {
      project: { select: { title: true } },
      client: { select: { name: true, email: true, company: true } },
    },
  });
  if (!invoice) notFound();

  // Support both old format { description, qty, unitPrice } and new format { description, amount }
  type LineItemRaw = { description: string; qty?: number; unitPrice?: number; amount?: number };
  const lineItems = (invoice.lineItems as LineItemRaw[]).map((l) => ({
    description: l.description,
    // New format provides amount directly; old format computes it from qty × unitPrice
    total: l.amount !== undefined ? l.amount : (l.qty ?? 1) * (l.unitPrice ?? 0),
    qty: l.qty,
    unitPrice: l.unitPrice,
    isNewFormat: l.amount !== undefined,
  }));

  const statusColors = INVOICE_STATUS_COLORS;

  return (
    <PortalShell title={invoice.number}>
      <div className="max-w-2xl space-y-6">
        <Link href="/portal/invoices" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Invoices
        </Link>

        <div className="rounded-xl border border-border p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">{invoice.number}</h2>
              {invoice.project && <p className="text-sm text-muted-foreground mt-0.5">{invoice.project.title}</p>}
            </div>
            <span className={`inline-block w-[76px] text-center text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[invoice.status] ?? "bg-muted text-muted-foreground"}`}>
              {invoice.status.toUpperCase()}
            </span>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Billed to</p>
              <p className="font-medium mt-1">{invoice.client.name ?? invoice.client.email}</p>
              {invoice.client.company && <p className="text-muted-foreground">{invoice.client.company}</p>}
            </div>
            <div>
              <p className="text-muted-foreground">Due date</p>
              <p className="font-medium mt-1">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "—"}</p>
            </div>
          </div>

          {/* Line items — desktop */}
          <div className="hidden sm:block rounded-lg border border-border overflow-hidden text-sm">
            <table className="w-full">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Description</th>
                  {lineItems.some((l) => !l.isNewFormat) && (
                    <>
                      <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Qty</th>
                      <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Unit</th>
                    </>
                  )}
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((l, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-3">{l.description}</td>
                    {!l.isNewFormat && (
                      <>
                        <td className="px-4 py-3 text-right text-muted-foreground">{l.qty ?? 1}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {fmtMoney(l.unitPrice ?? 0, invoice.currency)}
                        </td>
                      </>
                    )}
                    {l.isNewFormat && lineItems.some((x) => !x.isNewFormat) && (
                      <td colSpan={2} />
                    )}
                    <td className="px-4 py-3 text-right font-medium">
                      {fmtMoney(l.total, invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-border bg-muted/20">
                <tr>
                  <td colSpan={lineItems.some((l) => !l.isNewFormat) ? 3 : 1} className="px-4 py-3 text-right font-semibold">
                    Total
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-base">
                    {fmtMoney(invoice.amount, invoice.currency)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Line items — mobile */}
          <div className="sm:hidden space-y-2 text-sm">
            {lineItems.map((l, i) => (
              <div key={i} className="flex items-start justify-between p-3 rounded-xl border border-border gap-2">
                <div className="min-w-0">
                  <p className="font-medium">{l.description}</p>
                  {!l.isNewFormat && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {l.qty ?? 1} × {fmtMoney(l.unitPrice ?? 0, invoice.currency)}
                    </p>
                  )}
                </div>
                <p className="font-semibold shrink-0">{fmtMoney(l.total, invoice.currency)}</p>
              </div>
            ))}
            <div className="flex items-center justify-between px-3 pt-3 border-t border-border font-bold text-sm">
              <span>Total</span>
              <span>{fmtMoney(invoice.amount, invoice.currency)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {invoice.status !== "paid" && <PayButton invoiceId={id} />}
            <DownloadPdfButton invoiceId={id} invoiceNumber={invoice.number} />
          </div>

          {invoice.paidAt && (
            <p className="text-xs text-muted-foreground">
              Paid on {new Date(invoice.paidAt).toLocaleString()} · Ref: {invoice.paymentRef}
            </p>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
