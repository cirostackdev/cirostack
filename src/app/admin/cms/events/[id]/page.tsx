"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminFormSkeleton } from "@/components/admin/AdminSkeletons";

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/cms/events")
      .then((r) => r.json())
      .then((events) => {
        const found = events.find((e: any) => e.id === id);
        if (found) setForm(found);
      })
      .finally(() => setLoading(false));
  }, [id]);

  function update(field: string, value: any) {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { id: _id, createdAt, updatedAt, ...data } = form;
      const res = await fetch(`/api/admin/cms/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Event updated");
      router.push("/admin/cms/events");
    } catch {
      toast.error("Failed to update event");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminShell title="Edit Event"><AdminFormSkeleton /></AdminShell>;
  if (!form) return <AdminShell title="Edit Event"><p>Event not found</p></AdminShell>;

  return (
    <AdminShell title={`Edit: ${form.title}`}>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input value={form.slug || ""} onChange={(e) => update("slug", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={form.title || ""} onChange={(e) => update("title", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Type</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={form.type || "Webinar"}
              onChange={(e) => update("type", e.target.value)}
            >
              <option value="Webinar">Webinar</option>
              <option value="Conference Talk">Conference Talk</option>
              <option value="Workshop">Workshop</option>
              <option value="Meetup">Meetup</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input type="date" value={form.date || ""} onChange={(e) => update("date", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Time</Label>
            <Input value={form.time || ""} onChange={(e) => update("time", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input value={form.location || ""} onChange={(e) => update("location", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Attendees</Label>
            <Input type="number" value={form.attendees || 0} onChange={(e) => update("attendees", parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-1.5">
            <Label>Registration URL</Label>
            <Input value={form.registrationUrl || ""} onChange={(e) => update("registrationUrl", e.target.value)} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea value={form.description || ""} onChange={(e) => update("description", e.target.value)} rows={4} />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published ?? true} onChange={(e) => update("published", e.target.checked)} />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured ?? false} onChange={(e) => update("featured", e.target.checked)} />
            Featured
          </label>
        </div>

        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
      </form>
    </AdminShell>
  );
}
