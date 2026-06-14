"use client";

import { useState, useEffect } from "react";
import { StickyNote, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Note {
  id: string;
  body: string;
  createdAt: string;
  admin: { name: string };
}

export function NotesPanel({ conversationId }: { conversationId: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/conversations/${conversationId}/notes`)
      .then((r) => r.ok ? r.json() : [])
      .then(setNotes)
      .catch(() => {});
  }, [conversationId]);

  const addNote = async () => {
    if (!body.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/admin/conversations/${conversationId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (res.ok) {
      const note = await res.json();
      setNotes((prev) => [note, ...prev]);
      setBody("");
    }
    setSaving(false);
  };

  return (
    <div className="p-4 border-t border-border">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
        <StickyNote className="w-3.5 h-3.5" /> Internal Notes
      </p>

      <div className="flex gap-2 mb-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a note..."
          className="flex-1 min-h-[60px] px-2.5 py-2 text-xs border border-border rounded-lg bg-amber-50/50 dark:bg-amber-950/20 resize-none focus:outline-none focus:ring-1 focus:ring-amber-400"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addNote(); } }}
        />
        <button onClick={addNote} disabled={saving || !body.trim()}
          className="self-end p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 disabled:opacity-50 transition-colors">
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {notes.map((note) => (
          <div key={note.id} className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 rounded-lg px-3 py-2">
            <p className="text-xs whitespace-pre-wrap">{note.body}</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {note.admin.name} • {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
            </p>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-[11px] text-muted-foreground text-center py-2">No notes yet</p>
        )}
      </div>
    </div>
  );
}
