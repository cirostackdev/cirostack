import { clientAuth } from "@/auth-client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, CheckCircle, Circle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  discovery: "bg-blue-100 text-blue-700",
  proposal: "bg-yellow-100 text-yellow-700",
  active: "bg-green-100 text-green-700",
  review: "bg-purple-100 text-purple-700",
  complete: "bg-gray-200 text-gray-600",
  paused: "bg-orange-100 text-orange-700",
};

export default async function PortalDashboard() {
  const session = await clientAuth();
  if (!session?.user) redirect("/portal/login");

  const clientId = (session.user as any).id as string;

  const [projects, invoices] = await Promise.all([
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
  ]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back{session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{session.user.email}</p>
      </div>

      {/* Unpaid invoices alert */}
      {invoices.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-sm font-medium text-amber-800">{invoices.length} unpaid invoice{invoices.length > 1 ? "s" : ""} awaiting payment</p>
          <Link href="/portal/invoices" className="text-xs text-amber-700 underline mt-1 inline-block">View invoices →</Link>
        </div>
      )}

      {/* Projects */}
      <h2 className="font-semibold mb-4">Your Projects</h2>
      {projects.length === 0 ? (
        <div className="rounded-xl border border-border p-8 text-center text-muted-foreground text-sm">
          No projects yet. Your project manager will set this up for you.
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => {
            const done = p.milestones.filter((m) => m.completed).length;
            const total = p.milestones.length;
            return (
              <Link key={p.id} href={`/portal/projects/${p.id}`} className="block rounded-xl border border-border p-5 hover:bg-muted/20 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{p.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[p.status] ?? "bg-gray-100 text-gray-700"}`}>{p.status}</span>
                    </div>
                    {p.description && <p className="text-sm text-muted-foreground mb-3">{p.description}</p>}
                    {total > 0 && (
                      <div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Milestones</span>
                          <span>{done}/{total}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
