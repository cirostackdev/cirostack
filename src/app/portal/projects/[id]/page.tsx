import { clientAuth } from "@/auth-client";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Bell } from "lucide-react";
import { format } from "date-fns";
import { PortalShell } from "@/components/portal/PortalShell";
import { MilestoneApproval } from "./MilestoneApproval";
import { ProjectComments } from "./ProjectComments";
import { PROJECT_STATUS_COLORS, INVOICE_STATUS_COLORS } from "@/lib/colors";

const statusColors = PROJECT_STATUS_COLORS;
const invoiceStatusColors = INVOICE_STATUS_COLORS;

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

  return (
    <PortalShell title={project.title}>
      <div className="w-full space-y-8">
        <Link href="/portal/projects" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Projects
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">{project.title}</h2>
            {project.description && <p className="text-muted-foreground mt-1 text-sm">{project.description}</p>}
            {(project.startDate || project.dueDate) && (
              <p className="text-xs text-muted-foreground mt-1">
                {project.startDate && `Start: ${format(new Date(project.startDate), "MMM d, yyyy")}`}
                {project.startDate && project.dueDate && " · "}
                {project.dueDate && `Due: ${format(new Date(project.dueDate), "MMM d, yyyy")}`}
              </p>
            )}
          </div>
          <span className={`inline-block w-[76px] text-center text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[project.status] ?? "bg-muted text-muted-foreground"}`}>
            {project.status}
          </span>
        </div>

        {/* Milestones */}
        {project.milestones.length > 0 && (
          <MilestoneApproval
            projectId={project.id}
            initialMilestones={project.milestones.map((m) => ({
              id: m.id,
              title: m.title,
              dueDate: m.dueDate,
              completed: m.completed,
              completedAt: m.completedAt,
              order: m.order,
            }))}
          />
        )}

        {/* Updates */}
        <div>
          <h3 className="font-semibold mb-3">Updates</h3>
          {project.updates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-center space-y-2">
              <div className="w-9 h-9 rounded-full bg-muted mx-auto flex items-center justify-center">
                <Bell className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No updates from your team yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {project.updates.map((u) => (
                <div key={u.id} className="p-4 rounded-xl border border-border">
                  <p className="text-xs text-muted-foreground mb-1">{format(new Date(u.createdAt), "MMM d, yyyy")}</p>
                  <p className="text-sm whitespace-pre-wrap">{u.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comments & Feedback */}
        <ProjectComments projectId={project.id} />

        {/* Files */}
        {project.files.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Deliverables</h3>
            <div className="space-y-2">
              {project.files.map((f) => (
                <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors">
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium flex-1">{f.name}</span>
                  <Download className="w-4 h-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Invoices */}
        {project.invoices.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Invoices</h3>
            <div className="space-y-2">
              {project.invoices.map((inv) => (
                <Link key={inv.id} href={`/portal/invoices/${inv.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors">
                  <span className="text-sm font-medium">{inv.number}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{inv.currency} {(inv.amount / 100).toFixed(2)}</span>
                    <span className={`inline-block w-[76px] text-center text-xs px-2 py-0.5 rounded-full font-medium ${invoiceStatusColors[inv.status] ?? "bg-muted text-muted-foreground"}`}>
                      {inv.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PortalShell>
  );
}
