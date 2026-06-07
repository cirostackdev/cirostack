"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminFormSkeleton } from "@/components/admin/AdminSkeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JOB_DEPARTMENTS, JOB_TYPES } from "@/lib/admin-options";
import { toast } from "sonner";

type Form = { title: string; department: string; type: string; location: string; description: string; body: string; active: boolean };

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    fetch("/api/admin/cms/jobs").then((r) => r.json()).then((jobs: any[]) => {
      const job = jobs.find((j) => j.id === id);
      if (job) setForm({ title: job.title, department: job.department, type: job.type, location: job.location, description: job.description, body: job.body ?? "", active: job.active });
    });
  }, [id]);

  function set(key: string, value: unknown) { setForm((f) => f ? { ...f, [key]: value } : f); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    const res = await fetch(`/api/admin/cms/jobs/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { toast.success("Job updated"); router.push("/admin/cms/jobs"); }
    else { const { error } = await res.json(); toast.error(error ?? "Failed"); }
    setSaving(false);
  }

  if (!form) return <AdminShell title="Edit Job"><AdminFormSkeleton /></AdminShell>;

  return (
    <AdminShell title="Edit Job">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Title *</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} required /></div>
          <div className="space-y-1.5"><Label>Department *</Label><Select value={form.department} onValueChange={(v) => set("department", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{JOB_DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set("type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{JOB_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Location</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} /></div>
        </div>
        <div className="space-y-1.5"><Label>Short Description *</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} required rows={2} /></div>
        <div className="space-y-1.5"><Label>Full Description (Markdown)</Label><Textarea value={form.body} onChange={(e) => set("body", e.target.value)} rows={10} className="font-mono text-sm" /></div>
        <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={(v) => set("active", v)} /><Label>Active</Label></div>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </AdminShell>
  );
}
