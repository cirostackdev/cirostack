"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Download, Search, X, UserPlus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SUBMISSION_TYPE_COLORS } from "@/lib/colors";

interface Submission {
  id: string;
  type: string;
  data: Record<string, any>;
  status: string;
  createdAt: string;
}

const TYPE_COLORS = SUBMISSION_TYPE_COLORS;

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
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(submissions.map((s) => [s.id, s.status]))
  );
  const [converting, setConverting] = useState<string | null>(null);

  const types = Array.from(new Set(submissions.map((s) => s.type)));

  const filtered = submissions.filter((s) => {
    const matchType = filter === "" || s.type === filter;
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
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex flex-wrap gap-2 flex-1">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(filter === t ? "" : t)}
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
              className="h-8 text-xs pl-8 w-full sm:w-40"
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
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-3">
              <FileText className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No submissions found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or search term.</p>
          </div>
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
              <div className="px-4 pb-4 pt-3 border-t border-border bg-muted/20 space-y-4">
                {/* Key fields grid — skip base64 and long text */}
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {Object.entries(sub.data)
                    .filter(([key]) => !["cvBase64", "coverLetter", "message", "body"].includes(key))
                    .map(([key, value]) => {
                      const label = key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
                      const isUrl = typeof value === "string" && value.startsWith("http");
                      return (
                        <div key={key} className="min-w-0">
                          <dt className="text-xs font-medium text-muted-foreground capitalize mb-0.5">{label}</dt>
                          <dd className="text-sm text-foreground break-words">
                            {!value && value !== 0
                              ? <span className="text-muted-foreground/40">—</span>
                              : typeof value === "boolean"
                                ? value ? "Yes" : "No"
                                : isUrl
                                  ? <a href={String(value)} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate block">{String(value)}</a>
                                  : typeof value === "object"
                                    ? <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
                                    : String(value)}
                          </dd>
                        </div>
                      );
                    })}
                </dl>

                {/* CV download */}
                {sub.data?.cvBase64 && sub.data?.cvFileName && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">CV / Resume</p>
                    <a
                      href={`data:${sub.data.cvMimeType ?? "application/pdf"};base64,${sub.data.cvBase64}`}
                      download={sub.data.cvFileName}
                      className="inline-flex items-center gap-2 text-sm text-blue-500 hover:underline"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                      Download {sub.data.cvFileName}
                    </a>
                  </div>
                )}

                {/* Cover letter / message — full width, capped height */}
                {(sub.data?.coverLetter || sub.data?.message || sub.data?.body) && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">{sub.data?.coverLetter ? "Cover Letter" : "Message"}</p>
                    <div className="max-h-48 overflow-y-auto rounded-lg bg-background border border-border p-3 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {sub.data?.coverLetter || sub.data?.message || sub.data?.body}
                    </div>
                  </div>
                )}
                {sub.data?.email && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 text-xs"
                      disabled={converting === sub.id}
                      onClick={() => handleConvertToLead(sub)}
                    >
                      <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                      {converting === sub.id ? "Adding…" : "Add to Leads"}
                    </Button>
                    <a href={`mailto:${sub.data.email}`}>
                      <Button size="sm" variant="outline" className="h-9 text-xs">Reply by Email</Button>
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
