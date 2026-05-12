"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Job = { id: string; title: string; department: string; type: string; active: boolean };

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/cms/jobs");
    if (res.ok) setJobs(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this job?")) return;
    await fetch(`/api/admin/cms/jobs/${id}`, { method: "DELETE" });
    setJobs((j) => j.filter((x) => x.id !== id));
  }

  return (
    <AdminShell title="Jobs">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">{jobs.length} jobs</p>
          <Link href="/admin/cms/jobs/new">
            <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Job</Button>
          </Link>
        </div>
        {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Department</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{job.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{job.department}</td>
                    <td className="px-4 py-3 text-muted-foreground">{job.type}</td>
                    <td className="px-4 py-3">
                      <Badge variant={job.active ? "default" : "secondary"}>{job.active ? "Active" : "Inactive"}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/admin/cms/jobs/${job.id}`}><Button variant="ghost" size="icon" className="w-8 h-8"><Pencil className="w-3.5 h-3.5" /></Button></Link>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => handleDelete(job.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No jobs yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
