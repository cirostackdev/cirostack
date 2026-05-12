"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

type Project = { id: string; title: string; status: string; client: { email: string; name?: string; company?: string }; _count: { updates: number; files: number; invoices: number } };

const statusColors: Record<string, string> = {
  discovery: "bg-blue-100 text-blue-700",
  proposal: "bg-yellow-100 text-yellow-700",
  active: "bg-green-100 text-green-700",
  review: "bg-purple-100 text-purple-700",
  complete: "bg-gray-100 text-gray-700",
  paused: "bg-orange-100 text-orange-700",
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/projects").then((r) => r.json()).then((data) => { setProjects(data); setLoading(false); });
  }, []);

  return (
    <AdminShell title="Projects">
      <div className="p-6">
        <p className="text-sm text-muted-foreground mb-6">{projects.length} projects</p>
        {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
          <div className="rounded-xl border border-border overflow-hidden">
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
                {projects.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No projects yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
