"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeletons";
import { PUBLISH_STATUS_COLORS } from "@/lib/colors";
import { CmsBooleanToggle } from "@/components/admin/CmsBooleanToggle";
import { toast } from "sonner";

type Job = { id: string; title: string; department: string; type: string; active: boolean };

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/cms/jobs").then((r) => r.json()).then(setJobs).finally(() => setLoading(false));
  }, []);

  async function handleToggle(id: string, value: boolean) {
    setSaving(id);
    const res = await fetch(`/api/admin/cms/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: value }),
    });
    if (res.ok) {
      setJobs((prev) => prev.map((j) => j.id === id ? { ...j, active: value } : j));
      toast.success("Updated");
    } else { toast.error("Failed to update"); }
    setSaving(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this job?")) return;
    await fetch(`/api/admin/cms/jobs/${id}`, { method: "DELETE" });
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }

  return (
    <AdminShell title="Jobs / Careers">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{loading ? <span className="inline-block h-4 w-12 rounded bg-muted animate-pulse" /> : <>{jobs.length} jobs</>}</p>
        <Link href="/admin/cms/jobs/new"><Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Job</Button></Link>
      </div>
      {loading ? <AdminTableSkeleton cols={5} /> : (
        <>
          <div className="hidden md:block rounded-xl border border-border overflow-hidden">
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
                      <CmsBooleanToggle id={job.id} value={job.active} onLabel="Active" offLabel="Inactive" onClass={PUBLISH_STATUS_COLORS.active} offClass={PUBLISH_STATUS_COLORS.inactive} onChange={(id, v) => handleToggle(id, v)} saving={saving === job.id} />
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
          <div className="md:hidden space-y-2">
            {jobs.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No jobs yet.</p>}
            {jobs.map((job) => (
              <div key={job.id} className="p-4 rounded-xl border border-border">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{job.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{job.department} · {job.type}</p>
                  </div>
                  <CmsBooleanToggle id={job.id} value={job.active} onLabel="Active" offLabel="Inactive" onClass={PUBLISH_STATUS_COLORS.active} offClass={PUBLISH_STATUS_COLORS.inactive} onChange={(id, v) => handleToggle(id, v)} saving={saving === job.id} />
                </div>
                <div className="flex items-center gap-1 mt-3 justify-end">
                  <Link href={`/admin/cms/jobs/${job.id}`}><Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs"><Pencil className="w-3.5 h-3.5" /> Edit</Button></Link>
                  <Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => handleDelete(job.id)}><Trash2 className="w-3.5 h-3.5" /> Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminShell>
  );
}
