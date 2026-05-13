import { clientAuth } from "@/auth-client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Circle, Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";

const statusColors: Record<string, string> = {
  discovery: "bg-blue-100 text-blue-700",
  proposal: "bg-yellow-100 text-yellow-700",
  active: "bg-green-100 text-green-700",
  review: "bg-purple-100 text-purple-700",
  complete: "bg-gray-200 text-gray-600",
  paused: "bg-orange-100 text-orange-700",
};

export default async function PortalProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await clientAuth();
  if (!session?.user) redirect("/portal/login");

  const clientId = (session.user as any).id as string;
  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { id, clientId },
    include: {
      milestones: { orderBy: { order: "asc" } },
      updates: { where: { internal: false }, orderBy: { createdAt: "desc" } },
      files: { orderBy: { createdAt: "desc" } },
      invoices: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!project) notFound();

  const doneMilestones = project.milestones.filter((m) => m.completed).length;

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 max-w-3xl">
      <Link href="/portal/dashboard" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          {project.description && <p className="text-muted-foreground mt-1 text-sm">{project.description}</p>}
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${statusColors[project.status] ?? "bg-gray-100 text-gray-700"}`}>{project.status}</span>
      </div>

      {/* Milestones */}
      {project.milestones.length > 0 && (
        <section className="mb-8">
          <h2 className="font-semibold mb-3">Milestones <span className="text-muted-foreground font-normal text-sm">({doneMilestones}/{project.milestones.length})</span></h2>
          <div className="h-2 rounded-full bg-muted mb-4 overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${(doneMilestones / project.milestones.length) * 100}%` }} />
          </div>
          <div className="space-y-2">
            {project.milestones.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                {m.completed ? <CheckCircle className="w-5 h-5 text-green-600 shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground shrink-0" />}
                <span className={`text-sm flex-1 ${m.completed ? "line-through text-muted-foreground" : ""}`}>{m.title}</span>
                {m.dueDate && <span className="text-xs text-muted-foreground">{new Date(m.dueDate).toLocaleDateString()}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Updates */}
      <section className="mb-8">
        <h2 className="font-semibold mb-3">Updates</h2>
        {project.updates.length === 0 ? (
          <p className="text-sm text-muted-foreground">No updates yet.</p>
        ) : (
          <div className="space-y-3">
            {project.updates.map((u) => (
              <div key={u.id} className="p-4 rounded-xl border border-border">
                <p className="text-xs text-muted-foreground mb-1">{new Date(u.createdAt).toLocaleString()}</p>
                <p className="text-sm whitespace-pre-wrap">{u.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Files */}
      {project.files.length > 0 && (
        <section className="mb-8">
          <h2 className="font-semibold mb-3">Deliverables</h2>
          <div className="space-y-2">
            {project.files.map((f) => (
              <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors">
                <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium flex-1">{f.name}</span>
                <Download className="w-4 h-4 text-muted-foreground" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Invoices */}
      {project.invoices.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3">Invoices</h2>
          <div className="space-y-2">
            {project.invoices.map((inv) => (
              <Link key={inv.id} href={`/portal/invoices/${inv.id}`} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors">
                <span className="text-sm font-medium">{inv.number}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{inv.currency} {(inv.amount / 100).toFixed(2)}</span>
                  <Badge variant={inv.status === "paid" ? "default" : "secondary"}>{inv.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
