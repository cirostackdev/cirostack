import { clientAuth } from "@/auth-client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  ArrowRight, MessageSquare, Download, CreditCard, FileText,
  FolderOpen, Inbox, Bell, CheckCircle2, Clock, AlertCircle,
} from "lucide-react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { PortalShell } from "@/components/portal/PortalShell";
import { SetPasswordModal } from "@/app/portal/SetPasswordModal";
import { PROJECT_STATUS_COLORS, ALERT, INVOICE_STATUS_COLORS, SEMANTIC } from "@/lib/colors";

export default async function PortalDashboard() {
  const session = await clientAuth();
  if (!session?.user) redirect("/portal/login");

  const clientId = (session.user as any).id as string;

  const [
    clientData,
    projects,
    invoices,
    recentUpdates,
    recentFiles,
    unreadNotifs,
    conversation,
  ] = await Promise.all([
    prisma.client.findUnique({ where: { id: clientId }, select: { passwordHash: true } }),
    prisma.project.findMany({
      where: { clientId },
      orderBy: { updatedAt: "desc" },
      include: { milestones: { orderBy: { order: "asc" } } },
    }),
    prisma.invoice.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.projectUpdate.findMany({
      where: { project: { clientId }, internal: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { project: { select: { id: true, title: true } } },
    }),
    prisma.projectFile.findMany({
      where: { project: { clientId } },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { project: { select: { id: true, title: true } } },
    }),
    prisma.notification.count({ where: { clientId, read: false } }),
    prisma.conversation.findFirst({
      where: { visitorEmail: session.user.email! },
      orderBy: { updatedAt: "desc" },
      include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
    }),
  ]);

  const unpaidInvoices = invoices.filter((i) => i.status !== "paid");
  const paidInvoices = invoices.filter((i) => i.status === "paid");
  const overdueInvoices = unpaidInvoices.filter((i) => i.dueDate && isPast(new Date(i.dueDate)));
  const amountOwed = unpaidInvoices.reduce((sum, i) => sum + (i.amount / 100), 0);

  const activeProjects = projects.filter((p) => !["complete"].includes(p.status));

  type ActivityItem = { id: string; label: string; sub: string; href: string; time: Date; icon: "update" | "file" };
  const activity: ActivityItem[] = [
    ...recentUpdates.map((u) => ({
      id: `u-${u.id}`,
      label: u.project.title,
      sub: u.body.slice(0, 80) + (u.body.length > 80 ? "…" : ""),
      href: `/portal/projects/${u.project.id}`,
      time: u.createdAt,
      icon: "update" as const,
    })),
    ...recentFiles.map((f) => ({
      id: `f-${f.id}`,
      label: f.name,
      sub: f.project.title,
      href: f.url,
      time: f.createdAt,
      icon: "file" as const,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);

  const firstName = session.user.name ? session.user.name.split(" ")[0] : null;
  const needsPassword = !clientData?.passwordHash;

  return (
    <PortalShell title={`Welcome back${firstName ? `, ${firstName}` : ""}`}>
      {needsPassword && <SetPasswordModal />}
      <div className="w-full space-y-6">

        {/* Subheading */}
        <p className="text-sm text-muted-foreground -mt-2">{session.user.email}</p>

        {/* Welcome callout — empty workspace */}
        {projects.length === 0 && invoices.length === 0 && activity.length === 0 && (
          <div className="p-5 rounded-xl border border-border bg-muted/20">
            <p className="text-sm font-semibold mb-1">Your workspace is being set up</p>
            <p className="text-sm text-muted-foreground mb-4">Projects and invoices will appear here once your team gets started. In the meantime:</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/portal/chat" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                <MessageSquare className="w-3.5 h-3.5" /> Message your team
              </Link>
              <Link href="/portal/settings" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors">
                Set your password
              </Link>
            </div>
          </div>
        )}

        {/* Overdue alert */}
        {overdueInvoices.length > 0 && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${ALERT.danger}`}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {overdueInvoices.length} overdue invoice{overdueInvoices.length > 1 ? "s" : ""}
              </p>
            </div>
            <Link href="/portal/invoices" className="text-xs font-medium underline underline-offset-2 shrink-0">
              Pay now →
            </Link>
          </div>
        )}

        {/* Unpaid (non-overdue) alert */}
        {unpaidInvoices.length > 0 && overdueInvoices.length === 0 && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${ALERT.warning}`}>
            <Clock className="w-4 h-4 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {unpaidInvoices.length} unpaid invoice{unpaidInvoices.length > 1 ? "s" : ""} — ${amountOwed.toLocaleString()} due
              </p>
            </div>
            <Link href="/portal/invoices" className="text-xs font-medium underline underline-offset-2 shrink-0">
              View →
            </Link>
          </div>
        )}

        {/* KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Active Projects</p>
              <FolderOpen className={`w-4 h-4 ${SEMANTIC.accent}`} />
            </div>
            <p className={`text-2xl font-bold ${SEMANTIC.accent}`}>{activeProjects.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{projects.length} total</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Amount Owed</p>
              <CreditCard className={`w-4 h-4 ${unpaidInvoices.length > 0 ? SEMANTIC.warning : SEMANTIC.success}`} />
            </div>
            <p className={`text-2xl font-bold ${unpaidInvoices.length > 0 ? SEMANTIC.warning : SEMANTIC.success}`}>
              ${amountOwed.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{paidInvoices.length} paid</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Files</p>
              <Download className={`w-4 h-4 ${SEMANTIC.info}`} />
            </div>
            <p className={`text-2xl font-bold ${SEMANTIC.info}`}>{recentFiles.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">recent uploads</p>
          </div>
          <Link href="/portal/notifications" className="rounded-xl border border-border p-4 hover:bg-muted/20 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Notifications</p>
              <Bell className={`w-4 h-4 ${unreadNotifs > 0 ? SEMANTIC.danger : "text-muted-foreground"}`} />
            </div>
            <p className={`text-2xl font-bold ${unreadNotifs > 0 ? SEMANTIC.danger : "text-foreground"}`}>{unreadNotifs}</p>
            <p className="text-xs text-muted-foreground mt-0.5">unread</p>
          </Link>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Projects — left col */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Projects</h2>
              <Link href="/portal/projects" className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all →</Link>
            </div>

            {projects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-10 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-muted mx-auto flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">No projects yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Your project manager will set this up for you.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 4).map((p) => {
                  const done = p.milestones.filter((m) => m.completed).length;
                  const total = p.milestones.length;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  const isOverdue = p.dueDate && isPast(new Date(p.dueDate)) && p.status !== "complete";
                  return (
                    <Link key={p.id} href={`/portal/projects/${p.id}`} className="block rounded-xl border border-border p-4 hover:bg-muted/20 transition-colors group">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate mb-1">{p.title}</h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-block text-center text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${PROJECT_STATUS_COLORS[p.status] ?? "bg-muted text-muted-foreground"}`}>
                              {p.status}
                            </span>
                            {p.dueDate && (
                              <span className={`text-xs ${isOverdue ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                                {isOverdue ? "Overdue · " : "Due "}{format(new Date(p.dueDate), "MMM d, yyyy")}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {total > 0 && (
                        <div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                            <span>{done} of {total} milestones done</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${pct === 100 ? "bg-green-500" : "bg-primary"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Invoices summary */}
            {invoices.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold">Invoices</h2>
                  <Link href="/portal/invoices" className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all →</Link>
                </div>
                <div className="space-y-2">
                  {invoices.slice(0, 3).map((inv) => (
                    <Link key={inv.id} href={`/portal/invoices/${inv.id}`} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Invoice {inv.number}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {inv.dueDate ? `Due ${format(new Date(inv.dueDate), "MMM d, yyyy")}` : format(new Date(inv.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold">${(inv.amount / 100).toLocaleString()}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${INVOICE_STATUS_COLORS[inv.status] ?? "bg-muted text-muted-foreground"}`}>
                          {inv.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right col — activity + chat */}
          <div className="lg:col-span-2 space-y-4">

            {/* Chat card */}
            <Link
              href="/portal/chat"
              className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted/20 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Message your team</p>
                {conversation?.messages[0] ? (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {conversation.messages[0].body}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-0.5">Start a conversation</p>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            {/* Recent activity */}
            <div>
              <h2 className="font-semibold mb-3">Recent Activity</h2>
              {activity.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-muted mx-auto flex items-center justify-center">
                    <Inbox className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">No recent activity yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activity.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      target={item.icon === "file" ? "_blank" : undefined}
                      rel={item.icon === "file" ? "noopener noreferrer" : undefined}
                      className="flex items-start gap-3 p-3 rounded-xl border border-border hover:bg-muted/20 transition-colors group"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.icon === "file" ? "bg-blue-500/10" : "bg-primary/10"}`}>
                        {item.icon === "file"
                          ? <Download className="w-3.5 h-3.5 text-blue-500" />
                          : <FileText className="w-3.5 h-3.5 text-primary" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{item.label}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{item.sub}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                          {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Completed projects */}
            {projects.filter(p => p.status === "complete").length > 0 && (
              <div className="p-4 rounded-xl border border-border bg-green-500/5">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <p className="text-sm font-semibold text-green-500">
                    {projects.filter(p => p.status === "complete").length} completed project{projects.filter(p => p.status === "complete").length > 1 ? "s" : ""}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {projects.filter(p => p.status !== "complete").length > 0
                    ? `${projects.filter(p => p.status !== "complete").length} still in progress`
                    : "All done — great work!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
