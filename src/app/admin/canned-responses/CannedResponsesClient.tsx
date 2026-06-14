"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CannedResponse {
  id: string;
  title: string;
  shortcut: string | null;
  content: string;
  category: string;
}

export function CannedResponsesClient({ initialResponses }: { initialResponses: CannedResponse[] }) {
  const [responses, setResponses] = useState<CannedResponse[]>(initialResponses);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", shortcut: "", content: "", category: "General" });
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm({ title: "", shortcut: "", content: "", category: "General" });
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);

    if (editId) {
      const res = await fetch(`/api/admin/canned-responses/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        setResponses((prev) => prev.map((r) => r.id === editId ? updated : r));
        toast.success("Response updated");
        resetForm();
      }
    } else {
      const res = await fetch("/api/admin/canned-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const created = await res.json();
        setResponses((prev) => [...prev, created]);
        toast.success("Response created");
        resetForm();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this canned response?")) return;
    const res = await fetch(`/api/admin/canned-responses/${id}`, { method: "DELETE" });
    if (res.ok) {
      setResponses((prev) => prev.filter((r) => r.id !== id));
      toast.success("Deleted");
    }
  };

  const startEdit = (r: CannedResponse) => {
    setEditId(r.id);
    setForm({ title: r.title, shortcut: r.shortcut || "", content: r.content, category: r.category });
    setShowForm(true);
  };

  const categories = [...new Set(responses.map((r) => r.category))].sort();
  const filtered = responses.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.content.toLowerCase().includes(search.toLowerCase()) ||
    (r.shortcut && r.shortcut.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Canned Responses
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quick replies you can insert with "/" in conversations.
          </p>
        </div>
        <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-1" /> New Response
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search responses..."
          className="pl-10"
        />
      </div>

      {showForm && (
        <div className="border border-border rounded-lg p-4 space-y-4 bg-muted/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Greeting" />
            </div>
            <div className="space-y-2">
              <Label>Shortcut (type /shortcut)</Label>
              <Input value={form.shortcut} onChange={(e) => setForm({ ...form, shortcut: e.target.value })} placeholder="e.g., greeting" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="General" />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Type the response content..."
              className="w-full min-h-[100px] px-3 py-2 border border-border rounded-lg bg-background text-sm resize-y focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={saving || !form.title.trim() || !form.content.trim()}>
              {editId ? "Update" : "Create"}
            </Button>
            <Button size="sm" variant="ghost" onClick={resetForm}>Cancel</Button>
          </div>
        </div>
      )}

      {categories.map((cat) => {
        const items = filtered.filter((r) => r.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{cat}</h3>
            <div className="space-y-2">
              {items.map((r) => (
                <div key={r.id} className="flex items-start gap-3 px-4 py-3 rounded-lg border border-border hover:bg-muted/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{r.title}</span>
                      {r.shortcut && (
                        <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">/{r.shortcut}</code>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.content}</p>
                  </div>
                  <button onClick={() => startEdit(r)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground text-center py-8">
          {search ? "No matching responses." : "No canned responses yet. Create one to get started."}
        </p>
      )}
    </div>
  );
}
