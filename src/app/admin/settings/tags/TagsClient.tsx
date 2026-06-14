"use client";

import { useState } from "react";
import { Tag, Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const PRESET_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f97316",
  "#eab308", "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6",
];

interface TagItem {
  id: string;
  name: string;
  color: string;
  _count: { conversations: number };
}

export function TagsClient({ initialTags }: { initialTags: TagItem[] }) {
  const [tags, setTags] = useState<TagItem[]>(initialTags);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setName("");
    setColor(PRESET_COLORS[0]);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);

    if (editId) {
      const res = await fetch(`/api/admin/tags/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), color }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTags((prev) => prev.map((t) => t.id === editId ? { ...t, ...updated } : t));
        toast.success("Tag updated");
        resetForm();
      } else {
        toast.error("Failed to update tag");
      }
    } else {
      const res = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), color }),
      });
      if (res.ok) {
        const created = await res.json();
        setTags((prev) => [...prev, { ...created, _count: { conversations: 0 } }]);
        toast.success("Tag created");
        resetForm();
      } else {
        toast.error("Failed to create tag");
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tag? It will be removed from all conversations.")) return;
    const res = await fetch(`/api/admin/tags/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTags((prev) => prev.filter((t) => t.id !== id));
      toast.success("Tag deleted");
    }
  };

  const startEdit = (tag: TagItem) => {
    setEditId(tag.id);
    setName(tag.name);
    setColor(tag.color);
    setShowForm(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Tag className="w-5 h-5" /> Conversation Tags
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create tags to organize and categorize conversations.
          </p>
        </div>
        <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-1" /> New Tag
        </Button>
      </div>

      {showForm && (
        <div className="border border-border rounded-lg p-4 space-y-4 bg-muted/30">
          <div className="space-y-2">
            <Label>Tag Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Urgent, VIP, Follow-up"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={saving || !name.trim()}>
              {editId ? "Update" : "Create"}
            </Button>
            <Button size="sm" variant="ghost" onClick={resetForm}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {tags.length === 0 && !showForm && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No tags yet. Create one to start organizing conversations.
          </p>
        )}
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:bg-muted/40 transition-colors">
            <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
            <span className="font-medium text-sm flex-1">{tag.name}</span>
            <span className="text-xs text-muted-foreground">
              {tag._count.conversations} conversation{tag._count.conversations !== 1 ? "s" : ""}
            </span>
            <button onClick={() => startEdit(tag)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => handleDelete(tag.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
