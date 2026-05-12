"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";

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
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
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
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                    {p.featured && <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Featured</span>}
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
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
