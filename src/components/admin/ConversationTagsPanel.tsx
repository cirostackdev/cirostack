"use client";

import { useState, useEffect } from "react";
import { Tag, Plus, X } from "lucide-react";

interface ConvTag {
  id: string;
  name: string;
  color: string;
}

export function ConversationTagsPanel({ conversationId }: { conversationId: string }) {
  const [tags, setTags] = useState<ConvTag[]>([]);
  const [allTags, setAllTags] = useState<ConvTag[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    fetch("/api/admin/tags")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setAllTags(data))
      .catch(() => {});

    fetch(`/api/admin/conversations/${conversationId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.tags) setTags(data.tags);
      })
      .catch(() => {});
  }, [conversationId]);

  const addTag = async (tagId: string) => {
    const res = await fetch(`/api/admin/conversations/${conversationId}/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tagId }),
    });
    if (res.ok) {
      const tag = allTags.find((t) => t.id === tagId);
      if (tag) setTags((prev) => [...prev, tag]);
    }
    setShowPicker(false);
  };

  const removeTag = async (tagId: string) => {
    const res = await fetch(`/api/admin/conversations/${conversationId}/tags`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tagId }),
    });
    if (res.ok) {
      setTags((prev) => prev.filter((t) => t.id !== tagId));
    }
  };

  const availableTags = allTags.filter((t) => !tags.some((ct) => ct.id === t.id));

  return (
    <div className="p-4 border-t border-border">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Tags</p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-muted/80"
            style={{ color: tag.color }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
            {tag.name}
            <button onClick={() => removeTag(tag.id)} className="ml-0.5 hover:opacity-70">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {tags.length === 0 && !showPicker && (
          <span className="text-[11px] text-muted-foreground">No tags</span>
        )}
      </div>

      {showPicker ? (
        <div className="space-y-1 max-h-32 overflow-y-auto bg-muted/40 rounded-lg p-2">
          {availableTags.length === 0 ? (
            <p className="text-[11px] text-muted-foreground">No more tags available</p>
          ) : (
            availableTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => addTag(tag.id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted transition-colors text-left"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tag.color }} />
                <span className="text-xs">{tag.name}</span>
              </button>
            ))
          )}
          <button onClick={() => setShowPicker(false)} className="text-[11px] text-muted-foreground hover:text-foreground mt-1">
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowPicker(true)}
          className="text-[11px] text-primary hover:text-primary/80 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add tag
        </button>
      )}
    </div>
  );
}
