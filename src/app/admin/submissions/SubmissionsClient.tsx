"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Download, Search, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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

function exportCsv(submissions: Submission[]) {
  const header = "ID,Type,Name,Email,Status,Date";
  const rows = submissions.map((s) =>
    [
      s.id,
      s.type,
      s.data?.name || s.data?.fullName || "",
      s.data?.email || "",
      s.status,
      format(new Date(s.createdAt), "yyyy-MM-dd HH:mm"),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `submissions-${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function SubmissionsClient({ submissions }: { submissions: Submission[] }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(submissions.map((s) => [s.id, s.status]))
  );
  const [converting, setConverting] = useState<string | null>(null);

  const types = Array.from(new Set(submissions.map((s) => s.type)));

  const filtered = submissions.filter((s) => {
    const matchType = filter === "all" || s.type === filter;
    if (!matchType) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    const name = (s.data?.name || s.data?.fullName || "").toLowerCase();
    const email = (s.data?.email || "").toLowerCase();
    return name.includes(q) || email.includes(q) || s.type.includes(q);
  });

  const updateStatus = async (id: string, status: string) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
    await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  async function handleConvertToLead(sub: Submission) {
    const email = sub.data?.email;
    if (!email) { toast.error("No email in this submission"); return; }
    setConverting(sub.id);
    const res = await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name: sub.data?.name || sub.data?.fullName || null,
        source: sub.type,
        tags: [sub.type],
      }),
    });
    if (res.ok) toast.success("Added to Leads");
    else {
      const { error } = await res.json();
      toast.error(error ?? "Failed");
    }
    setConverting(null);
  }

  return (
    <div className="p-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex flex-wrap gap-2 flex-1">
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
        <div className="flex gap-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 text-xs pl-8 w-36"
            />
            {search && (
              <button className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setSearch("")}>
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => exportCsv(filtered)}>
            <Download className="w-3.5 h-3.5 mr-1" /> CSV
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-center py-12 text-muted-foreground text-sm">No submissions found.</p>
        )}
        {filtered.map((sub) => (
          <div key={sub.id} className="border border-border rounded-xl overflow-hidden">
            <div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors gap-2"
              onClick={() => setExpanded(expanded === sub.id ? null : sub.id)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                    TYPE_COLORS[sub.type] || "bg-muted text-muted-foreground"
                  }`}
                >
                  {sub.type}
                </span>
                <div className="min-w-0">
                  <span className="text-sm font-medium truncate block">
                    {sub.data?.name || sub.data?.fullName || sub.data?.email || "—"}
                  </span>
                  {sub.data?.email && sub.data?.name && (
                    <span className="text-xs text-muted-foreground truncate block">{sub.data.email}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
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
              <div className="px-4 pb-4 pt-2 border-t border-border bg-muted/20 space-y-3">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {Object.entries(sub.data).map(([key, value]) => (
                    <div key={key} className="min-w-0">
                      <dt className="text-xs font-medium text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim()}
                      </dt>
                      <dd className="text-sm text-foreground break-words mt-0.5">
                        {value === null || value === undefined || value === ""
                          ? <span className="text-muted-foreground/50">—</span>
                          : typeof value === "boolean"
                            ? value ? "Yes" : "No"
                            : typeof value === "object"
                              ? <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
                              : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
                {sub.data?.email && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7"
                      disabled={converting === sub.id}
                      onClick={() => handleConvertToLead(sub)}
                    >
                      <UserPlus className="w-3.5 h-3.5 mr-1" />
                      {converting === sub.id ? "Adding…" : "Add to Leads"}
                    </Button>
                    <a href={`mailto:${sub.data.email}`}>
                      <Button size="sm" variant="outline" className="text-xs h-7">Reply by Email</Button>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
