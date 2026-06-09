import { clientAuth } from "@/auth-client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PortalShell } from "@/components/portal/PortalShell";
import { FileText, Download, FolderOpen } from "lucide-react";
import { format } from "date-fns";

export default async function PortalFilesPage() {
  const session = await clientAuth();
  if (!session?.user) redirect("/portal/login");
  const clientId = (session.user as any).id as string;

  const files = await prisma.projectFile.findMany({
    where: { project: { clientId } },
    include: { project: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Group by project
  const grouped = files.reduce<Record<string, { projectTitle: string; projectId: string; files: typeof files }>>((acc, file) => {
    const key = file.projectId;
    if (!acc[key]) {
      acc[key] = { projectTitle: file.project.title, projectId: file.project.id, files: [] };
    }
    acc[key].files.push(file);
    return acc;
  }, {});

  const groups = Object.values(grouped);

  return (
    <PortalShell title="Files">
      <div className="w-full">
        {files.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-14 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-muted mx-auto flex items-center justify-center">
              <FolderOpen className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">No files yet</p>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
                Deliverables and documents shared by your team will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map((group) => (
              <div key={group.projectId}>
                <div className="flex items-center gap-2 mb-3">
                  <FolderOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                  <h2 className="font-semibold text-sm">{group.projectTitle}</h2>
                  <span className="text-xs text-muted-foreground">({group.files.length})</span>
                </div>
                <div className="space-y-2">
                  {group.files.map((file) => (
                    <a
                      key={file.id}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:bg-muted/20 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {format(new Date(file.createdAt), "MMM d, yyyy")}
                          {file.size ? ` · ${(file.size / 1024).toFixed(0)} KB` : ""}
                        </p>
                      </div>
                      <Download className="w-4 h-4 text-muted-foreground shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalShell>
  );
}
