import { clientAuth } from "@/auth-client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, FolderOpen } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { PROJECT_STATUS_COLORS } from "@/lib/colors";

const statusColors = PROJECT_STATUS_COLORS;

export default async function PortalProjectsPage() {
  const session = await clientAuth();
  if (!session?.user) redirect("/portal/login");

  const clientId = (session.user as any).id as string;

  const projects = await prisma.project.findMany({
    where: { clientId },
    orderBy: { updatedAt: "desc" },
    include: {
      milestones: { orderBy: { order: "asc" } },
      _count: { select: { updates: true, files: true, invoices: true } },
    },
  });

  return (
    <PortalShell title="Projects">
      <div className="max-w-3xl">
        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-muted mx-auto flex items-center justify-center">
              <FolderOpen className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">No projects yet</p>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
                Your project manager will create your first project and you&apos;ll see it here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((p) => {
              const done = p.milestones.filter((m) => m.completed).length;
              const total = p.milestones.length;
              return (
                <Link
                  key={p.id}
                  href={`/portal/projects/${p.id}`}
                  className="block rounded-xl border border-border p-5 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h2 className="font-semibold truncate">{p.title}</h2>
                        <span className={`inline-block w-[76px] text-center text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[p.status] ?? "bg-muted text-muted-foreground"}`}>
                          {p.status}
                        </span>
                      </div>

                      {total > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Milestones</span>
                            <span>{done}/{total}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {p._count.updates > 0 && <span>{p._count.updates} update{p._count.updates !== 1 ? "s" : ""}</span>}
                        {p._count.files > 0 && <span>{p._count.files} file{p._count.files !== 1 ? "s" : ""}</span>}
                        {p._count.invoices > 0 && <span>{p._count.invoices} invoice{p._count.invoices !== 1 ? "s" : ""}</span>}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </PortalShell>
  );
}
