"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeletons";

interface ResourceItem {
  id: string;
  slug: string;
  type: string;
  title: string;
  tags: string[];
  published: boolean;
  isNew: boolean;
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/cms/resources")
      .then((r) => r.json())
      .then(setResources)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this resource?")) return;
    await fetch(`/api/admin/cms/resources/${id}`, { method: "DELETE" });
    setResources((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <AdminShell title="Resources">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{resources.length} resources</p>
        <Link href="/admin/cms/resources/new">
          <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Resource</Button>
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
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Tags</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3 font-medium">{r.title}</td>
                    <td className="p-3 text-muted-foreground">{r.type}</td>
                    <td className="p-3 text-muted-foreground">{r.tags?.join(", ")}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.published ? "bg-green-500/15 text-green-500" : "bg-yellow-500/15 text-yellow-500"}`}>
                        {r.published ? "Published" : "Draft"}
                      </span>
                      {r.isNew && <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-500">New</span>}
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <Link href={`/admin/cms/resources/${r.id}`}>
                        <Button variant="ghost" size="sm"><Pencil className="w-4 h-4" /></Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(r.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {resources.length === 0 && (
                  <tr><td colSpan={5} className="p-3 text-center text-muted-foreground">No resources yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {resources.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No resources yet.</p>}
            {resources.map((r) => (
              <div key={r.id} className="p-4 rounded-xl border border-border">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.type}{r.tags?.length ? ` · ${r.tags.join(", ")}` : ""}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.published ? "bg-green-500/15 text-green-500" : "bg-yellow-500/15 text-yellow-500"}`}>
                      {r.published ? "Published" : "Draft"}
                    </span>
                    {r.isNew && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-500">New</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 justify-end">
                  <Link href={`/admin/cms/resources/${r.id}`}>
                    <Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs"><Pencil className="w-3.5 h-3.5" /> Edit</Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => handleDelete(r.id)}>
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
