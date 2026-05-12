import { clientAuth } from "@/auth-client";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PayButton from "./PayButton";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await clientAuth();
  if (!session?.user) redirect("/portal/login");
  const clientId = (session.user as any).id as string;
  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: { id, clientId },
    include: { project: { select: { title: true } }, client: { select: { name: true, email: true, company: true } } },
  });
  if (!invoice) notFound();

  const lineItems = invoice.lineItems as { description: string; qty: number; unitPrice: number }[];

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 max-w-2xl">
      <Link href="/portal/invoices" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Invoices
      </Link>

      <div className="rounded-xl border border-border p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">{invoice.number}</h1>
            {invoice.project && <p className="text-sm text-muted-foreground mt-0.5">{invoice.project.title}</p>}
          </div>
          <Badge variant={invoice.status === "paid" ? "default" : "secondary"} className="text-sm px-3 py-1">
            {invoice.status.toUpperCase()}
          </Badge>
        </div>

        {/* Client info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
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

        {/* Line items */}
        <div className="rounded-lg border border-border overflow-hidden text-sm">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-muted-foreground">Description</th>
                <th className="text-right px-4 py-2 font-medium text-muted-foreground">Qty</th>
                <th className="text-right px-4 py-2 font-medium text-muted-foreground">Unit</th>
                <th className="text-right px-4 py-2 font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((l, i) => (
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
        <div className="flex items-center gap-3">
          {invoice.status !== "paid" && <PayButton invoiceId={id} />}
          <Link href={`/api/portal/invoices/${id}/pdf`} target="_blank">
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1.5" /> Download</Button>
          </Link>
        </div>

        {invoice.paidAt && (
          <p className="text-xs text-muted-foreground">Paid on {new Date(invoice.paidAt).toLocaleString()} · Ref: {invoice.paymentRef}</p>
        )}
      </div>
    </div>
  );
}
