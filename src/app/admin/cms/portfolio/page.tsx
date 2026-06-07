"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeletons";

interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  client: string;
  vertical: string;
  service: string;
  published: boolean;
  featured: boolean;
}

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/cms/portfolio")
      .then((r) => r.json())
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this portfolio project?")) return;
    await fetch(`/api/admin/cms/portfolio/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <AdminShell title="Portfolio / Case Studies">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{projects.length} projects</p>
        <Link href="/admin/cms/portfolio/new">
          <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Project</Button>
        </Link>
      </div>

      {loading ? (
        <AdminTableSkeleton cols={5} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Title</th>
                  <th className="text-left p-3 font-medium">Client</th>
                  <th className="text-left p-3 font-medium">Vertical</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3 font-medium">{p.title}</td>
                    <td className="p-3 text-muted-foreground">{p.client}</td>
                    <td className="p-3 text-muted-foreground">{p.vertical}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.published ? "bg-green-500/15 text-green-500" : "bg-yellow-500/15 text-yellow-500"}`}>
                        {p.published ? "Published" : "Draft"}
                      </span>
                      {p.featured && <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-500">Featured</span>}
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <Link href={`/admin/cms/portfolio/${p.id}`}>
                        <Button variant="ghost" size="sm"><Pencil className="w-4 h-4" /></Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr><td colSpan={5} className="p-3 text-center text-muted-foreground">No projects yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {projects.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No projects yet.</p>}
            {projects.map((p) => (
              <div key={p.id} className="p-4 rounded-xl border border-border">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.client} · {p.vertical}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.published ? "bg-green-500/15 text-green-500" : "bg-yellow-500/15 text-yellow-500"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                    {p.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-500">Featured</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 justify-end">
                  <Link href={`/admin/cms/portfolio/${p.id}`}>
                    <Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs"><Pencil className="w-3.5 h-3.5" /> Edit</Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminShell>
  );
}
