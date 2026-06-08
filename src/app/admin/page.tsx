import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  DollarSign,
  FolderKanban,
  Users,
  Receipt,
  ArrowRight,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import { SEMANTIC } from "@/lib/colors";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [paidInvoices, activeProjects, leads, unpaidInvoices, recentPaid, recentLeads] =
    await Promise.all([
      prisma.invoice.aggregate({
        where: { status: "paid" },
        _sum: { amount: true },
      }),
      prisma.project.count({ where: { status: { in: ["active", "review"] } } }),
      prisma.lead.count(),
      prisma.invoice.aggregate({
        where: { status: { in: ["unpaid", "overdue"] } },
        _count: { id: true },
        _sum: { amount: true },
      }),
      prisma.invoice.findMany({
        where: { status: "paid" },
        orderBy: { paidAt: "desc" },
        take: 5,
        include: { client: { select: { name: true, email: true } } },
      }),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const totalRevenue = ((paidInvoices._sum.amount ?? 0) / 100);
  const unpaidTotal = ((unpaidInvoices._sum.amount ?? 0) / 100);
  const fmtUsd = (n: number) =>
    `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const KPI_CARDS = [
    {
      label: "Total Revenue",
      value: fmtUsd(totalRevenue),
      sub: "From paid invoices",
      icon: DollarSign,
      color: SEMANTIC.success,
      href: "/admin/invoices",
    },
    {
      label: "Active Projects",
      value: String(activeProjects),
      sub: "In progress or review",
      icon: FolderKanban,
      color: SEMANTIC.info,
      href: "/admin/projects",
    },
    {
      label: "Open Leads",
      value: String(leads),
      sub: "Total in pipeline",
      icon: Users,
      color: SEMANTIC.accent,
      href: "/admin/leads",
    },
    {
      label: "Unpaid Invoices",
      value: String(unpaidInvoices._count.id),
      sub: `${fmtUsd(unpaidTotal)} outstanding`,
      icon: Receipt,
      color: SEMANTIC.warning,
      href: "/admin/invoices",
    },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="max-w-5xl space-y-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                href={card.href}
                className="rounded-xl border border-border p-4 hover:bg-muted/20 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Paid Invoices */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-sm font-semibold flex items-center gap-1.5">
                <CheckCircle className={`w-4 h-4 ${SEMANTIC.success}`} /> Recent Payments
              </p>
              <Link href="/admin/invoices" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentPaid.length === 0 && (
                <p className="px-4 py-6 text-sm text-muted-foreground text-center">No paid invoices yet.</p>
              )}
              {recentPaid.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/admin/invoices/${inv.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{inv.number}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {inv.client.name ?? inv.client.email}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className={`font-semibold ${SEMANTIC.success}`}>
                      {inv.currency} {(inv.amount / 100).toFixed(2)}
                    </p>
                    {inv.paidAt && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(inv.paidAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Leads */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-sm font-semibold flex items-center gap-1.5">
                <UserPlus className={`w-4 h-4 ${SEMANTIC.accent}`} /> Recent Leads
              </p>
              <Link href="/admin/leads" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentLeads.length === 0 && (
                <p className="px-4 py-6 text-sm text-muted-foreground text-center">No leads yet.</p>
              )}
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href="/admin/leads"
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{lead.email}</p>
                    {lead.name && <p className="text-xs text-muted-foreground truncate">{lead.name}</p>}
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    {lead.source && (
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full capitalize">
                        {lead.source}
                      </span>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-sm font-semibold mb-3">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/invoices/new" className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors font-medium">
              <Receipt className="w-4 h-4" /> New Invoice
            </Link>
            <Link href="/admin/projects/new" className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors font-medium">
              <FolderKanban className="w-4 h-4" /> New Project
            </Link>
            <Link href="/admin/clients" className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors font-medium">
              <Users className="w-4 h-4" /> Manage Clients
            </Link>
            <Link href="/admin/leads" className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors font-medium">
              <UserPlus className="w-4 h-4" /> View Leads
            </Link>
          </div>
        </div>

      </div>
    </AdminShell>
  );
}
