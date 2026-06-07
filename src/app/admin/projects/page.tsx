"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { ChevronRight, FolderKanban } from "lucide-react";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeletons";

type Project = { id: string; title: string; status: string; client: { email: string; name?: string; company?: string }; _count: { updates: number; files: number; invoices: number } };

const statusColors: Record<string, string> = {
  discovery: "bg-blue-500/15 text-blue-500",
  proposal: "bg-yellow-500/15 text-yellow-500",
  active: "bg-green-500/15 text-green-500",
  review: "bg-purple-500/15 text-purple-500",
  complete: "bg-muted text-muted-foreground",
  paused: "bg-orange-500/15 text-orange-500",
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/projects").then((r) => r.json()).then((data) => { setProjects(data); setLoading(false); });
  }, []);

  return (
    <AdminShell title="Projects">
        <p className="text-sm text-muted-foreground mb-6">{projects.length} projects</p>
        {loading ? <AdminTableSkeleton cols={5} /> : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Activity</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">{p.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.client.name ?? p.client.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[p.status] ?? "bg-gray-100 text-gray-700"}`}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{p._count.updates} updates · {p._count.files} files · {p._count.invoices} invoices</td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/projects/${p.id}`}><Button variant="ghost" size="icon" className="w-8 h-8"><ChevronRight className="w-4 h-4" /></Button></Link>
                      </td>
                    </tr>
                  ))}
                  {projects.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                            <FolderKanban className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">No projects yet</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="md:hidden space-y-2">
              {projects.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                    <FolderKanban className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No projects yet</p>
                </div>
              )}
              {projects.map((p) => (
                <Link key={p.id} href={`/admin/projects/${p.id}`} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{p.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[p.status] ?? "bg-gray-100 text-gray-700"}`}>{p.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.client.name ?? p.client.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p._count.updates} updates · {p._count.files} files · {p._count.invoices} invoices</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 ml-3" />
                </Link>
              ))}
            </div>
          </>
        )}
    </AdminShell>
  );
}
