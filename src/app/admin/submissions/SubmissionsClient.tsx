"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Submission {
  id: string;
  type: string;
  data: Record<string, any>;
  status: string;
  createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  start: "bg-blue-500/20 text-blue-400",
  consultation: "bg-purple-500/20 text-purple-400",
  careers: "bg-yellow-500/20 text-yellow-400",
  press: "bg-pink-500/20 text-pink-400",
  events: "bg-orange-500/20 text-orange-400",
  newsletter: "bg-green-500/20 text-green-400",
  resources: "bg-teal-500/20 text-teal-400",
};

export function SubmissionsClient({ submissions }: { submissions: Submission[] }) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(submissions.map((s) => [s.id, s.status]))
  );

  const types = Array.from(new Set(submissions.map((s) => s.type)));
  const filtered = filter === "all" ? submissions : submissions.filter((s) => s.type === filter);

  const updateStatus = async (id: string, status: string) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
    await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  return (
    <div className="p-4">
      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["all", ...types].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              filter === t
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-center py-12 text-muted-foreground text-sm">No submissions yet.</p>
        )}
        {filtered.map((sub) => (
          <div key={sub.id} className="border border-border rounded-xl overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setExpanded(expanded === sub.id ? null : sub.id)}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                    TYPE_COLORS[sub.type] || "bg-muted text-muted-foreground"
                  }`}
                >
                  {sub.type}
                </span>
                <span className="text-sm font-medium">
                  {sub.data?.name || sub.data?.fullName || sub.data?.email || "—"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {sub.data?.email && sub.data?.name ? sub.data.email : ""}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={statuses[sub.id]}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updateStatus(sub.id, e.target.value)}
                  className="text-xs bg-muted border border-border rounded-lg px-2 py-1 outline-none"
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="actioned">Actioned</option>
                </select>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(sub.createdAt), "MMM d, HH:mm")}
                </span>
                {expanded === sub.id ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {expanded === sub.id && (
              <div className="px-4 pb-4 pt-2 border-t border-border bg-muted/20">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap overflow-auto">
                  {JSON.stringify(sub.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
