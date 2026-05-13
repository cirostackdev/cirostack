import { clientAuth } from "@/auth-client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "default", unpaid: "secondary", overdue: "destructive", cancelled: "outline",
};

export default async function PortalInvoicesPage() {
  const session = await clientAuth();
  if (!session?.user) redirect("/portal/login");
  const clientId = (session.user as any).id as string;

  const invoices = await prisma.invoice.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
    include: { project: { select: { title: true } } },
  });

  const total = invoices.reduce((s, i) => s + i.amount, 0);
  const paid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const outstanding = total - paid;

  return (
    <PortalShell title="Invoices">
      <div className="max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-xl font-bold mt-1">USD {(total / 100).toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Paid</p>
            <p className="text-xl font-bold mt-1 text-green-600">USD {(paid / 100).toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Outstanding</p>
            <p className="text-xl font-bold mt-1 text-amber-600">USD {(outstanding / 100).toFixed(2)}</p>
          </div>
        </div>

        <div className="space-y-3">
          {invoices.map((inv) => (
            <Link key={inv.id} href={`/portal/invoices/${inv.id}`} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/20 transition-colors gap-3">
              <div className="min-w-0">
                <p className="font-medium truncate">{inv.number}</p>
                {inv.project && <p className="text-xs text-muted-foreground mt-0.5 truncate">{inv.project.title}</p>}
              </div>
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <span className="text-sm font-medium">{inv.currency} {(inv.amount / 100).toFixed(2)}</span>
                <Badge variant={statusVariant[inv.status] ?? "secondary"}>{inv.status}</Badge>
                <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
              </div>
            </Link>
          ))}
          {invoices.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No invoices yet.</p>}
        </div>
      </div>
    </PortalShell>
  );
}
