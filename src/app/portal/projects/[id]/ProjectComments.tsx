"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Comment {
  id: string;
  body: string;
  createdAt: string;
}

export function ProjectComments({ projectId }: { projectId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/portal/projects/${projectId}/comments`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
      })
      .catch(() => {});
  }, [projectId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/portal/projects/${projectId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim() }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to post comment");
        return;
      }
      const comment = await res.json();
      setComments((prev) => [...prev, comment]);
      setBody("");
      toast.success("Comment posted");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <MessageCircle className="w-4 h-4" /> Comments & Feedback
      </h3>

      {comments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center space-y-2">
          <div className="w-9 h-9 rounded-full bg-muted mx-auto flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No comments yet. Share your feedback below.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="p-4 rounded-xl border border-border">
              <p className="text-sm whitespace-pre-wrap">{c.body}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-2">
        <Textarea
          placeholder="Write your feedback..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="rounded-xl border resize-none"
          rows={3}
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={loading || !body.trim()}>
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
