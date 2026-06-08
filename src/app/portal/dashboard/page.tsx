import { clientAuth } from "@/auth-client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, MessageSquare, Download, CreditCard, FileText, FolderOpen, Inbox } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PortalShell } from "@/components/portal/PortalShell";
import { SetPasswordModal } from "@/app/portal/SetPasswordModal";
import { PROJECT_STATUS_COLORS, ALERT } from "@/lib/colors";

const statusColors = PROJECT_STATUS_COLORS;

export default async function PortalDashboard() {
  const session = await clientAuth();
  if (!session?.user) redirect("/portal/login");

  const clientId = (session.user as any).id as string;

  const [clientData, projects, unpaidInvoices, recentUpdates, recentFiles] = await Promise.all([
    prisma.client.findUnique({ where: { id: clientId }, select: { passwordHash: true } }),
    prisma.project.findMany({
      where: { clientId },
      orderBy: { updatedAt: "desc" },
      include: { milestones: { orderBy: { order: "asc" } } },
    }),
    prisma.invoice.findMany({
      where: { clientId, status: { not: "paid" } },
      orderBy: { createdAt: "desc" },
      take: 3,
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
      take: 3,
      include: { project: { select: { id: true, title: true } } },
    }),
  ]);

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
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  const firstName = session.user.name ? session.user.name.split(" ")[0] : null;

  const needsPassword = !clientData?.passwordHash;

  return (
    <PortalShell title={`Welcome back${firstName ? `, ${firstName}` : ""}`}>
      {needsPassword && <SetPasswordModal />}
      <div className="w-full">
        <p className="text-sm text-muted-foreground mb-6">{session.user.email}</p>

        {/* Welcome callout for empty workspace */}
        {projects.length === 0 && unpaidInvoices.length === 0 && activity.length === 0 && (
          <div className="mb-6 p-5 rounded-xl border border-border bg-muted/20">
            <p className="text-sm font-semibold mb-1">Welcome to your client portal</p>
            <p className="text-sm text-muted-foreground mb-4">Your workspace is being set up. Here&apos;s what you can do while you wait:</p>
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

        {/* Unpaid invoices alert */}
        {unpaidInvoices.length > 0 && (
          <div className={`mb-6 p-4 rounded-xl border ${ALERT.warning}`}>
            <p className="text-sm font-medium">
              {unpaidInvoices.length} unpaid invoice{unpaidInvoices.length > 1 ? "s" : ""} awaiting payment
            </p>
            <Link href="/portal/invoices" className="text-xs underline mt-1 inline-block opacity-80 hover:opacity-100">
              View invoices →
            </Link>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <Link href="/portal/projects" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors text-center">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-medium">Projects</span>
          </Link>
          <Link href="/portal/invoices" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors text-center">
            <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-green-500" />
            </div>
            <span className="text-xs font-medium">Invoices</span>
          </Link>
          {recentFiles[0] && (
            <a href={recentFiles[0].url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors text-center">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Download className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-xs font-medium truncate w-full">Latest File</span>
            </a>
          )}
          {unpaidInvoices[0] && (
            <Link href={`/portal/invoices/${unpaidInvoices[0].id}`} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 hover:bg-amber-500/10 transition-colors text-center">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-xs font-medium">Pay Now</span>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Projects */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Projects</h2>
              <Link href="/portal/projects" className="text-xs text-muted-foreground hover:text-foreground">View all →</Link>
            </div>
            {projects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-muted mx-auto flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">No projects yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Your project manager will set this up for you.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 4).map((p) => {
                  const done = p.milestones.filter((m) => m.completed).length;
                  const total = p.milestones.length;
                  return (
                    <Link key={p.id} href={`/portal/projects/${p.id}`} className="block rounded-xl border border-border p-4 hover:bg-muted/20 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-medium text-sm truncate">{p.title}</h3>
                            <span className={`inline-block w-[76px] text-center text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[p.status] ?? "bg-muted text-muted-foreground"}`}>{p.status}</span>
                          </div>
                          {total > 0 && (
                            <div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>Milestones</span><span>{done}/{total}</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${(done / total) * 100}%` }} />
                              </div>
                            </div>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="lg:col-span-2">
            <h2 className="font-semibold mb-4">Recent Activity</h2>
            {activity.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-muted mx-auto flex items-center justify-center">
                  <Inbox className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">No recent activity to show.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activity.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    target={item.icon === "file" ? "_blank" : undefined}
                    rel={item.icon === "file" ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border hover:bg-muted/20 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${item.icon === "file" ? "bg-blue-500/10" : "bg-primary/10"}`}>
                      {item.icon === "file"
                        ? <Download className="w-3.5 h-3.5 text-blue-500" />
                        : <MessageSquare className="w-3.5 h-3.5 text-primary" />}
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
        </div>
      </div>
    </PortalShell>
  );
}
