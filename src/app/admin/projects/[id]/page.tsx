"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDetailSkeleton } from "@/components/admin/AdminSkeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, Circle, Plus, Upload } from "lucide-react";

type Project = {
  id: string; title: string; status: string; description?: string;
  client: { id: string; email: string; name?: string };
  milestones: Milestone[];
  updates: Update[];
  files: ProjectFile[];
};
type Milestone = { id: string; title: string; completed: boolean; dueDate?: string; order: number };
type Update = { id: string; body: string; internal: boolean; createdAt: string };
type ProjectFile = { id: string; name: string; url: string; size?: number; createdAt: string };

const STATUSES = ["discovery", "proposal", "active", "review", "complete", "paused"];

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [status, setStatus] = useState("");
  const [updateText, setUpdateText] = useState("");
  const [internal, setInternal] = useState(false);
  const [posting, setPosting] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const res = await fetch(`/api/admin/projects/${id}`);
    if (res.ok) { const data = await res.json(); setProject(data); setStatus(data.status); }
  }
  useEffect(() => { load(); }, [id]);

  async function handleStatusChange(s: string) {
    setStatus(s);
    await fetch(`/api/admin/projects/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: s }) });
    toast.success("Status updated");
  }

  async function handleMilestoneToggle(m: Milestone) {
    await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ milestones: [{ id: m.id, completed: !m.completed }] }),
    });
    load();
  }

  async function handlePostUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!updateText.trim()) return;
    setPosting(true);
    const res = await fetch(`/api/admin/projects/${id}/updates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: updateText, internal }),
    });
    if (res.ok) { toast.success("Update posted"); setUpdateText(""); load(); }
    else toast.error("Failed to post");
    setPosting(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/admin/projects/${id}/files`, { method: "POST", body: fd });
    if (res.ok) { toast.success("File uploaded"); load(); }
    else toast.error("Upload failed");
    setUploading(false);
  }

  if (!project) return <AdminShell title="Project"><AdminDetailSkeleton /></AdminShell>;

  return (
    <AdminShell title={project.title}>
      <div className="p-6 max-w-4xl space-y-8">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">Client: {project.client.name ?? project.client.email}</p>
          </div>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {/* Milestones */}
        <div>
          <h3 className="font-semibold mb-3">Milestones</h3>
          <div className="space-y-2">
            {project.milestones.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <button onClick={() => handleMilestoneToggle(m)}>
                  {m.completed ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                </button>
                <span className={`text-sm flex-1 ${m.completed ? "line-through text-muted-foreground" : ""}`}>{m.title}</span>
                {m.dueDate && <span className="text-xs text-muted-foreground">{m.dueDate.slice(0, 10)}</span>}
              </div>
            ))}
            {project.milestones.length === 0 && <p className="text-sm text-muted-foreground">No milestones.</p>}
          </div>
        </div>

        {/* Post update */}
        <div>
          <h3 className="font-semibold mb-3">Post Update</h3>
          <form onSubmit={handlePostUpdate} className="space-y-3">
            <Textarea value={updateText} onChange={(e) => setUpdateText(e.target.value)} rows={3} placeholder="Write an update for the client…" />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><Switch checked={internal} onCheckedChange={setInternal} /><Label>Internal (not shown to client)</Label></div>
              <Button type="submit" size="sm" disabled={posting}>{posting ? "Posting…" : "Post Update"}</Button>
            </div>
          </form>
        </div>

        {/* Updates feed */}
        <div>
          <h3 className="font-semibold mb-3">Updates</h3>
          <div className="space-y-3">
            {project.updates.map((u) => (
              <div key={u.id} className={`p-4 rounded-xl border ${u.internal ? "border-dashed border-muted-foreground/30 bg-muted/10" : "border-border"}`}>
                <div className="flex items-center gap-2 mb-1">
                  {u.internal && <Badge variant="outline" className="text-xs">Internal</Badge>}
                  <span className="text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm">{u.body}</p>
              </div>
            ))}
            {project.updates.length === 0 && <p className="text-sm text-muted-foreground">No updates yet.</p>}
          </div>
        </div>

        {/* Files */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Files</h3>
            <label className="cursor-pointer">
              <Button size="sm" variant="outline" asChild>
                <span><Upload className="w-4 h-4 mr-1" />{uploading ? "Uploading…" : "Upload File"}</span>
              </Button>
              <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>
          <div className="space-y-2">
            {project.files.map((f) => (
              <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors">
                <span className="text-sm font-medium">{f.name}</span>
                <span className="text-xs text-muted-foreground">{f.size ? `${(f.size / 1024).toFixed(1)} KB` : ""}</span>
              </a>
            ))}
            {project.files.length === 0 && <p className="text-sm text-muted-foreground">No files yet.</p>}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
