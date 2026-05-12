"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";

export default function NewEventPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    type: "Webinar",
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    attendees: 0,
    registrationUrl: "",
    featured: false,
    published: true,
  });

  function update(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cms/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create");
      }
      toast.success("Event created");
      router.push("/admin/cms/events");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title="New Event">
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Slug *</Label>
            <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="my-event-slug" required />
          </div>
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Event Title" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Type</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
            >
              <option value="Webinar">Webinar</option>
              <option value="Conference Talk">Conference Talk</option>
              <option value="Workshop">Workshop</option>
              <option value="Meetup">Meetup</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Date *</Label>
            <Input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Time</Label>
            <Input value={form.time} onChange={(e) => update("time", e.target.value)} placeholder="2:00 PM WAT" />
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Virtual / Lagos, Nigeria" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Attendees</Label>
            <Input type="number" value={form.attendees} onChange={(e) => update("attendees", parseInt(e.target.value) || 0)} placeholder="0" />
          </div>
          <div className="space-y-1.5">
            <Label>Registration URL</Label>
            <Input value={form.registrationUrl} onChange={(e) => update("registrationUrl", e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Description *</Label>
          <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Event description..." required rows={4} />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
            Featured
          </label>
        </div>

        <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Event"}</Button>
      </form>
    </AdminShell>
  );
}
