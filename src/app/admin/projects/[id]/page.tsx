"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDetailSkeleton } from "@/components/admin/AdminSkeletons";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, Circle, Plus, Upload, Trash2, Pencil } from "lucide-react";
import { PROJECT_STATUS_COLORS, SEMANTIC } from "@/lib/colors";

type Project = {
  id: string; title: string; status: string; description?: string;
  startDate?: string; dueDate?: string;
  client: { id: string; email: string; name?: string };
  milestones: Milestone[];
  updates: Update[];
  files: ProjectFile[];
};
type Milestone = { id: string; title: string; completed: boolean; dueDate?: string; order: number };
type Update = { id: string; body: string; internal: boolean; createdAt: string };
type ProjectFile = { id: string; name: string; url: string; size?: number; createdAt: string };

const STATUSES = ["discovery", "proposal", "active", "review", "complete", "paused"];

const statusColors = PROJECT_STATUS_COLORS;

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [status, setStatus] = useState("");
  const [updateText, setUpdateText] = useState("");
  const [internal, setInternal] = useState(false);
  const [posting, setPosting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Edit project dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", description: "", startDate: "", dueDate: "" });
  const [editSaving, setEditSaving] = useState(false);

  // Add milestone dialog
  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({ title: "", dueDate: "" });
  const [milestoneAdding, setMilestoneAdding] = useState(false);

  // Edit milestone dialog
  const [editMilestone, setEditMilestone] = useState<Milestone | null>(null);
  const [editMilestoneForm, setEditMilestoneForm] = useState({ title: "", dueDate: "" });
  const [editMilestoneSaving, setEditMilestoneSaving] = useState(false);

  async function load() {
    const res = await fetch(`/api/admin/projects/${id}`);
    if (res.ok) {
      const data = await res.json();
      setProject(data);
      setStatus(data.status);
      setEditForm({
        title: data.title,
        description: data.description ?? "",
        startDate: data.startDate ? data.startDate.slice(0, 10) : "",
        dueDate: data.dueDate ? data.dueDate.slice(0, 10) : "",
      });
    }
  }
  useEffect(() => { load(); }, [id]);

  async function handleStatusChange(s: string) {
    setStatus(s);
    await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: s }),
    });
    toast.success("Status updated");
  }

  async function handleEditProject(e: React.FormEvent) {
    e.preventDefault();
    setEditSaving(true);
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editForm.title,
        description: editForm.description || null,
        startDate: editForm.startDate || null,
        dueDate: editForm.dueDate || null,
      }),
    });
    if (res.ok) { toast.success("Project updated"); setEditOpen(false); load(); }
    else toast.error("Failed to update project");
    setEditSaving(false);
  }

  async function handleDeleteProject() {
    if (!confirm("Delete this project and all its milestones, updates, and files?")) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Project deleted"); router.push("/admin/projects"); }
    else { toast.error("Failed to delete"); setDeleting(false); }
  }

  async function handleMilestoneToggle(m: Milestone) {
    await fetch(`/api/admin/projects/${id}/milestones/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !m.completed }),
    });
    load();
  }

  async function handleAddMilestone(e: React.FormEvent) {
    e.preventDefault();
    setMilestoneAdding(true);
    const res = await fetch(`/api/admin/projects/${id}/milestones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: milestoneForm.title, dueDate: milestoneForm.dueDate || null }),
    });
    if (res.ok) {
      toast.success("Milestone added");
      setMilestoneOpen(false);
      setMilestoneForm({ title: "", dueDate: "" });
      load();
    } else toast.error("Failed to add milestone");
    setMilestoneAdding(false);
  }

  async function handleEditMilestoneSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editMilestone) return;
    setEditMilestoneSaving(true);
    const res = await fetch(`/api/admin/projects/${id}/milestones/${editMilestone.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editMilestoneForm.title, dueDate: editMilestoneForm.dueDate || null }),
    });
    if (res.ok) { toast.success("Milestone updated"); setEditMilestone(null); load(); }
    else toast.error("Failed to update milestone");
    setEditMilestoneSaving(false);
  }

  async function handleDeleteMilestone(milestoneId: string) {
    if (!confirm("Delete this milestone?")) return;
    const res = await fetch(`/api/admin/projects/${id}/milestones/${milestoneId}`, { method: "DELETE" });
    if (res.ok) { toast.success("Milestone deleted"); load(); }
    else toast.error("Failed to delete milestone");
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

  async function handleDeleteUpdate(updateId: string) {
    if (!confirm("Delete this update?")) return;
    const res = await fetch(`/api/admin/projects/${id}/updates/${updateId}`, { method: "DELETE" });
    if (res.ok) { toast.success("Update deleted"); load(); }
    else toast.error("Failed to delete update");
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

  async function handleDeleteFile(fileId: string) {
    if (!confirm("Remove this file?")) return;
    const res = await fetch(`/api/admin/projects/${id}/files/${fileId}`, { method: "DELETE" });
    if (res.ok) { toast.success("File removed"); load(); }
    else toast.error("Failed to remove file");
  }

  if (!project) return <AdminShell title="Project"><AdminDetailSkeleton /></AdminShell>;

  return (
    <AdminShell title={project.title}>
      <div className="max-w-4xl space-y-8">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">Client: {project.client.name ?? project.client.email}</p>
            {project.description && <p className="text-sm text-muted-foreground mt-0.5">{project.description}</p>}
            {(project.startDate || project.dueDate) && (
              <p className="text-xs text-muted-foreground mt-1">
                {project.startDate && `Start: ${format(new Date(project.startDate), "MMM d, yyyy")}`}
                {project.startDate && project.dueDate && " · "}
                {project.dueDate && `Due: ${format(new Date(project.dueDate), "MMM d, yyyy")}`}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>Edit</Button>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={handleDeleteProject} disabled={deleting}>
              <Trash2 className="w-3.5 h-3.5 mr-1" />{deleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </div>

        {/* Edit project dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Project</DialogTitle></DialogHeader>
            <form onSubmit={handleEditProject} className="space-y-4 mt-2">
              <div className="space-y-1.5"><Label>Title *</Label><Input value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} required /></div>
              <div className="space-y-1.5"><Label>Description</Label><Textarea value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} rows={2} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Start Date</Label><Input type="date" value={editForm.startDate} onChange={(e) => setEditForm((f) => ({ ...f, startDate: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Due Date</Label><Input type="date" value={editForm.dueDate} onChange={(e) => setEditForm((f) => ({ ...f, dueDate: e.target.value }))} /></div>
              </div>
              <Button type="submit" disabled={editSaving} className="w-full">{editSaving ? "Saving…" : "Save Changes"}</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit milestone dialog */}
        <Dialog open={!!editMilestone} onOpenChange={(o) => !o && setEditMilestone(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Milestone</DialogTitle></DialogHeader>
            <form onSubmit={handleEditMilestoneSave} className="space-y-4 mt-2">
              <div className="space-y-1.5"><Label>Title *</Label><Input value={editMilestoneForm.title} onChange={(e) => setEditMilestoneForm((f) => ({ ...f, title: e.target.value }))} required /></div>
              <div className="space-y-1.5"><Label>Due Date</Label><Input type="date" value={editMilestoneForm.dueDate} onChange={(e) => setEditMilestoneForm((f) => ({ ...f, dueDate: e.target.value }))} /></div>
              <Button type="submit" disabled={editMilestoneSaving} className="w-full">{editMilestoneSaving ? "Saving…" : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Milestones */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Milestones</h3>
            <Button size="sm" variant="outline" onClick={() => setMilestoneOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add Milestone
            </Button>
          </div>

          <Dialog open={milestoneOpen} onOpenChange={setMilestoneOpen}>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Milestone</DialogTitle></DialogHeader>
              <form onSubmit={handleAddMilestone} className="space-y-4 mt-2">
                <div className="space-y-1.5"><Label>Title *</Label><Input value={milestoneForm.title} onChange={(e) => setMilestoneForm((f) => ({ ...f, title: e.target.value }))} required autoFocus /></div>
                <div className="space-y-1.5"><Label>Due Date</Label><Input type="date" value={milestoneForm.dueDate} onChange={(e) => setMilestoneForm((f) => ({ ...f, dueDate: e.target.value }))} /></div>
                <Button type="submit" disabled={milestoneAdding} className="w-full">{milestoneAdding ? "Adding…" : "Add Milestone"}</Button>
              </form>
            </DialogContent>
          </Dialog>

          <div className="space-y-2">
            {project.milestones.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border">
                <button
                  onClick={() => handleMilestoneToggle(m)}
                  className="min-w-[36px] min-h-[36px] flex items-center justify-center shrink-0 rounded-lg hover:bg-muted transition-colors"
                >
                  {m.completed ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                </button>
                <span className={`text-sm flex-1 min-w-0 ${m.completed ? "line-through text-muted-foreground" : ""}`}>{m.title}</span>
                {m.dueDate && <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">{format(new Date(m.dueDate), "MMM d, yyyy")}</span>}
                <div className="flex items-center gap-0.5 shrink-0">
                  <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => { setEditMilestone(m); setEditMilestoneForm({ title: m.title, dueDate: m.dueDate?.slice(0, 10) ?? "" }); }}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => handleDeleteMilestone(m.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            {project.milestones.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-xl">No milestones yet.</p>
            )}
          </div>
        </div>

        {/* Post update */}
        <div>
          <h3 className="font-semibold mb-3">Post Update</h3>
          <form onSubmit={handlePostUpdate} className="space-y-3">
            <Textarea value={updateText} onChange={(e) => setUpdateText(e.target.value)} rows={3} placeholder="Write an update for the client…" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2"><Switch checked={internal} onCheckedChange={setInternal} /><Label>Internal (not shown to client)</Label></div>
              <Button type="submit" size="sm" disabled={posting} className="sm:ml-auto">{posting ? "Posting…" : "Post Update"}</Button>
            </div>
          </form>
        </div>

        {/* Updates feed */}
        <div>
          <h3 className="font-semibold mb-3">Updates</h3>
          <div className="space-y-3">
            {project.updates.map((u) => (
              <div key={u.id} className={`p-4 rounded-xl border ${u.internal ? "border-dashed border-muted-foreground/30 bg-muted/10" : "border-border"}`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    {u.internal && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Internal</span>}
                    <span className="text-xs text-muted-foreground">{format(new Date(u.createdAt), "MMM d, yyyy")}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive shrink-0" onClick={() => handleDeleteUpdate(u.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <p className="text-sm">{u.body}</p>
              </div>
            ))}
            {project.updates.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-xl">No updates yet.</p>
            )}
          </div>
        </div>

        {/* Invoices */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Invoices</h2>
            <Link href={`/admin/invoices/new?projectId=${project.id}&clientId=${project.client.id}`}><Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-1" /> New Invoice</Button></Link>
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
              <div key={f.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex-1 hover:underline truncate">{f.name}</a>
                <span className="text-xs text-muted-foreground shrink-0">{f.size ? `${(f.size / 1024).toFixed(1)} KB` : ""}</span>
                <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive shrink-0" onClick={() => handleDeleteFile(f.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
            {project.files.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-xl">No files yet.</p>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
