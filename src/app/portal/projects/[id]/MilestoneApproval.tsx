"use client";

import { useState } from "react";
import { CheckCircle, Circle, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { INTERACTIVE } from "@/lib/colors";

type Milestone = {
  id: string;
  title: string;
  dueDate: Date | null;
  completed: boolean;
  completedAt: Date | null;
  order: number;
};

export function MilestoneApproval({
  projectId,
  initialMilestones,
}: {
  projectId: string;
  initialMilestones: Milestone[];
}) {
  const [milestones, setMilestones] = useState(initialMilestones);
  const [approving, setApproving] = useState<string | null>(null);

  const doneMilestones = milestones.filter((m) => m.completed).length;

  async function handleApprove(milestoneId: string) {
    setApproving(milestoneId);
    try {
      const res = await fetch(`/api/portal/projects/${projectId}/milestones/${milestoneId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });
      if (res.ok) {
        setMilestones((prev) =>
          prev.map((m) => m.id === milestoneId ? { ...m, completed: true, completedAt: new Date() } : m)
        );
        toast.success("Milestone approved");
      } else {
        toast.error("Failed to approve milestone");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setApproving(null);
    }
  }

  return (
    <div>
      <h3 className="font-semibold mb-3">
        Milestones{" "}
        <span className="text-muted-foreground font-normal text-sm">({doneMilestones}/{milestones.length})</span>
      </h3>
      <div className="h-2 rounded-full bg-muted mb-4 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${milestones.length > 0 ? (doneMilestones / milestones.length) * 100 : 0}%` }}
        />
      </div>
      <div className="space-y-2">
        {milestones.map((m) => (
          <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
            {m.completed
              ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              : <Circle className="w-5 h-5 text-muted-foreground shrink-0" />}
            <span className={`text-sm flex-1 ${m.completed ? "line-through text-muted-foreground" : ""}`}>{m.title}</span>
            {m.dueDate && <span className="text-xs text-muted-foreground">{format(new Date(m.dueDate), "MMM d, yyyy")}</span>}
            {!m.completed && (
              <Button
                size="sm"
                variant="outline"
                className={`h-7 px-2.5 text-xs gap-1 ${INTERACTIVE.success}`}
                disabled={approving === m.id}
                onClick={() => handleApprove(m.id)}
              >
                <ThumbsUp className="w-3 h-3" />
                {approving === m.id ? "Approving..." : "Approve"}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
