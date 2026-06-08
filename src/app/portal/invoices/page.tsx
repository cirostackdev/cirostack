import { clientAuth } from "@/auth-client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Receipt } from "lucide-react";
import { fmtMoney } from "@/lib/format";
import { PortalShell } from "@/components/portal/PortalShell";
import { INVOICE_STATUS_COLORS, SEMANTIC } from "@/lib/colors";

const statusColors = INVOICE_STATUS_COLORS;

export default async function PortalInvoicesPage() {
  const session = await clientAuth();
  if (!session?.user) redirect("/portal/login");
  const clientId = (session.user as any).id as string;

  const invoices = await prisma.invoice.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
    include: { project: { select: { title: true } } },
  });

  // Sum all amounts in USD using the stored exchange rate at time of invoice creation
  const toUsd = (inv: typeof invoices[0]) => (inv.amount / 100) * (inv.usdRate ?? 1);
  const totalUsd = invoices.reduce((s, i) => s + toUsd(i), 0);
  const paidUsd = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + toUsd(i), 0);
  const outstandingUsd = totalUsd - paidUsd;
  const fmtUsd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <PortalShell title="Invoices">
      <div className="max-w-3xl">
        {invoices.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total</p>
              <p className="text-2xl font-bold mt-1.5">{fmtUsd(totalUsd)}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">USD equivalent at invoice date</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Paid</p>
              <p className={`text-2xl font-bold mt-1.5 ${SEMANTIC.success}`}>{fmtUsd(paidUsd)}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">USD equivalent at invoice date</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Outstanding</p>
              <p className={`text-2xl font-bold mt-1.5 ${SEMANTIC.warning}`}>{fmtUsd(outstandingUsd)}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">USD equivalent at invoice date</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {invoices.map((inv) => (
            <Link key={inv.id} href={`/portal/invoices/${inv.id}`} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:bg-muted/20 transition-colors gap-3">
              <div className="min-w-0">
                <p className="font-semibold truncate">{inv.number}</p>
                {inv.project && <p className="text-xs text-muted-foreground mt-0.5 truncate">{inv.project.title}</p>}
              </div>
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <span className="text-sm font-semibold">{fmtMoney(inv.amount, inv.currency)}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColors[inv.status] ?? "bg-muted text-muted-foreground"}`}>
                  {inv.status}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
              </div>
            </Link>
          ))}
          {invoices.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-14 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-muted mx-auto flex items-center justify-center">
                <Receipt className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">No invoices yet</p>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
                  When your team sends you an invoice, it will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
