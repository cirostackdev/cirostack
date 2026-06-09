"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  DollarSign, Users, TrendingUp, FolderKanban, AlertTriangle,
  Clock, CheckCircle2, BarChart2, MessageCircle, FileEdit,
} from "lucide-react";
import { PROJECT_STATUS_COLORS, SEMANTIC } from "@/lib/colors";

// ── Types ────────────────────────────────────────────────────────────────────

type AnalyticsData = {
  meta: { days: number };
  kpis: { periodRevenue: number; periodLeads: number; conversionRate: number; newClients: number; overdueInvoices: number };
  pipeline: {
    funnel: { submissions: number; leads: number; qualified: number; won: number };
    leadsByStatus: Record<string, number>;
    leadSources: { source: string; total: number; won: number }[];
    leadVelocity: { week: string; new: number; won: number }[];
    subsByType: { type: string; count: number; actioned: number }[];
    subsByStatus: Record<string, number>;
  };
  financial: {
    periodRevenue: number; pipelineValue: number; avgPaymentDays: number;
    monthly: { label: string; year: number; total: number }[];
    aging: { bucket: string; count: number; amount: number }[];
    topClients: { name: string; email: string; total: number }[];
  };
  projects: {
    byStatus: { status: string; count: number }[];
    timeline: { label: string; created: number; completed: number }[];
    overdueList: { id: string; title: string; status: string; client: string; daysOverdue: number | null }[];
    milestones: { total: number; completed: number; rate: number };
    engagement: { comments: number; updates: number };
  };
  content: Record<string, { total: number; published?: number; draft?: number; featured?: number; active?: number; inactive?: number }>;
  conversations: { periodTotal: number; openNow: number; unreadMessages: number; avgMsgsPerConv: number };
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmtUsd = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`rounded bg-muted animate-pulse ${className}`} />;
}

function BarRow({ label, value, max, color = "bg-primary", suffix = "" }: {
  label: string; value: number; max: number; color?: string; suffix?: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-24 shrink-0 truncate capitalize">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium w-14 text-right shrink-0">{suffix || value}</span>
    </div>
  );
}

const LEAD_STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500", contacted: "bg-amber-500", qualified: "bg-green-500",
  won: "bg-emerald-500", lost: "bg-red-500",
};
const LEAD_STATUS_TEXT: Record<string, string> = {
  new: "text-blue-500", contacted: "text-amber-500", qualified: "text-green-500",
  won: "text-emerald-500", lost: "text-red-500",
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/admin/analytics?days=${days}`)
      .then((r) => {
        if (!r.ok) {
          console.error("[Analytics] API returned:", r.status, r.statusText);
          throw new Error(`API returned ${r.status}`);
        }
        return r.json();
      })
      .then((d) => { setData(d); setLoading(false); })
      .catch((err) => {
        console.error("[Analytics] Failed to fetch:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [days]);

  const RANGE_OPTS = [
    { label: "7d", value: 7 },
    { label: "30d", value: 30 },
    { label: "90d", value: 90 },
    { label: "1y", value: 365 },
  ];

  return (
    <AdminShell title="Analytics">
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-500 text-sm">
          Failed to load analytics: {error}
        </div>
      )}
      <div className="space-y-10">

        {/* Date range */}
        <div className="flex items-center gap-1.5">
          {RANGE_OPTS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDays(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                days === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
          <span className="text-xs text-muted-foreground ml-2">
            {loading ? "Loading…" : `Data for last ${days === 365 ? "12 months" : `${days} days`}`}
          </span>
        </div>

        {/* ── KPI row ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Revenue", value: loading ? null : fmtUsd(data?.kpis.periodRevenue ?? 0), icon: DollarSign, color: SEMANTIC.success },
            { label: "New Leads", value: loading ? null : String(data?.kpis.periodLeads ?? 0), icon: Users, color: SEMANTIC.accent },
            { label: "Win Rate", value: loading ? null : `${data?.kpis.conversionRate ?? 0}%`, icon: TrendingUp, color: SEMANTIC.info },
            { label: "New Clients", value: loading ? null : String(data?.kpis.newClients ?? 0), icon: FolderKanban, color: SEMANTIC.emphasis },
            { label: "Overdue Inv.", value: loading ? null : String(data?.kpis.overdueInvoices ?? 0), icon: AlertTriangle, color: SEMANTIC.danger },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              {value === null
                ? <Skeleton className="h-8 w-20 mt-1" />
                : <p className={`text-2xl font-bold ${color}`}>{value}</p>}
            </div>
          ))}
        </div>

        {/* ── Business Pipeline ─────────────────────────────────────────────── */}
        <div>
          <SectionHeader title="Business Pipeline" sub="End-to-end funnel from submission to won client" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Funnel */}
            <div className="rounded-xl border border-border p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Acquisition Funnel</p>
              {loading ? (
                <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8" />)}</div>
              ) : (
                <div className="space-y-2">
                  {[
                    { label: "Form Submissions", value: data?.pipeline.funnel.submissions ?? 0, color: "bg-blue-500" },
                    { label: "Total Leads", value: data?.pipeline.funnel.leads ?? 0, color: "bg-purple-500" },
                    { label: "Qualified", value: data?.pipeline.funnel.qualified ?? 0, color: "bg-amber-500" },
                    { label: "Won", value: data?.pipeline.funnel.won ?? 0, color: "bg-green-500" },
                  ].map((step, i, arr) => {
                    const max = arr[0].value || 1;
                    const pct = Math.round((step.value / max) * 100);
                    return (
                      <div key={step.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">{step.label}</span>
                          <span className="text-xs font-semibold">{step.value} {i > 0 && max > 0 ? <span className="text-muted-foreground font-normal">({pct}%)</span> : null}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${step.color} rounded-full transition-all duration-700`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Lead status distribution */}
            <div className="rounded-xl border border-border p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Lead Status Distribution (All Time)</p>
              {loading ? (
                <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}</div>
              ) : (
                <div className="space-y-2.5">
                  {Object.entries(data?.pipeline.leadsByStatus ?? {}).map(([status, count]) => {
                    const total = Object.values(data?.pipeline.leadsByStatus ?? {}).reduce((a, b) => a + b, 0);
                    return (
                      <div key={status} className="flex items-center gap-3">
                        <span className={`inline-block w-[76px] text-center text-xs px-2 py-0.5 rounded-full font-medium ${LEAD_STATUS_TEXT[status] ?? "text-muted-foreground"} ${LEAD_STATUS_COLORS[status]?.replace("bg-", "bg-") + "/15" ?? "bg-muted"}`}>
                          {status}
                        </span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${LEAD_STATUS_COLORS[status] ?? "bg-muted-foreground"} transition-all duration-500`}
                            style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
                          />
                        </div>
                        <span className="text-xs font-medium w-6 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Lead velocity */}
          <div className="rounded-xl border border-border p-5 mt-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Lead Velocity — New vs Won (Weekly)</p>
            {loading ? (
              <div className="h-28 bg-muted/30 rounded animate-pulse" />
            ) : (data?.pipeline.leadVelocity.every(w => w.new === 0)) ? (
              <p className="text-xs text-muted-foreground text-center py-6">No leads in this period.</p>
            ) : (
              <div className="space-y-3">
                {/* Legend */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-2 rounded-sm bg-purple-500/60" />New</span>
                  <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-2 rounded-sm bg-emerald-500" />Won</span>
                </div>
                <div className="flex items-end gap-1 h-24">
                  {data?.pipeline.leadVelocity.map((w, i) => {
                    const maxNew = Math.max(...(data.pipeline.leadVelocity.map(x => x.new)), 1);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end group" title={`${w.week}: ${w.new} new, ${w.won} won`}>
                        <div className="w-full flex items-end gap-0.5 justify-center h-full">
                          <div className="w-[45%] bg-purple-500/60 rounded-t-sm min-h-[2px]" style={{ height: `${Math.max((w.new / maxNew) * 100, w.new > 0 ? 4 : 0)}%` }} />
                          <div className="w-[45%] bg-emerald-500 rounded-t-sm min-h-[2px]" style={{ height: `${Math.max((w.won / maxNew) * 100, w.won > 0 ? 4 : 0)}%` }} />
                        </div>
                        <span className="text-[9px] text-muted-foreground truncate w-full text-center">{w.week}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Lead sources + submission types */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="rounded-xl border border-border p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Lead Sources</p>
              {loading ? (
                <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}</div>
              ) : data?.pipeline.leadSources.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No lead source data yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {data?.pipeline.leadSources.map((s) => (
                    <BarRow key={s.source} label={s.source} value={s.total} max={data.pipeline.leadSources[0]?.total || 1} color="bg-purple-500" />
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Submissions by Type + Actioned Rate</p>
              {loading ? (
                <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}</div>
              ) : data?.pipeline.subsByType.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No submissions in this period.</p>
              ) : (
                <div className="space-y-3">
                  {data?.pipeline.subsByType.map((s) => {
                    const actionedPct = s.count > 0 ? Math.round((s.actioned / s.count) * 100) : 0;
                    return (
                      <div key={s.type}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground capitalize">{s.type}</span>
                          <span className="text-xs text-muted-foreground">{s.count} total · <span className="text-green-500 font-medium">{actionedPct}% actioned</span></span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                          <div className="h-full bg-blue-500/40 rounded-full absolute" style={{ width: "100%" }} />
                          <div className="h-full bg-green-500 rounded-full absolute" style={{ width: `${actionedPct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Financial Health ──────────────────────────────────────────────── */}
        <div>
          <SectionHeader title="Financial Health" sub="Revenue, invoice aging, and client value" />

          {/* Revenue chart */}
          <div className="rounded-xl border border-border p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Monthly Revenue (Last 12 Months)</p>
              {!loading && (
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Pipeline: <span className="font-semibold text-amber-500">{fmtUsd(data?.financial.pipelineValue ?? 0)}</span></span>
                  <span>Avg pay: <span className="font-semibold">{data?.financial.avgPaymentDays ?? 0}d</span></span>
                </div>
              )}
            </div>
            {loading ? (
              <div className="h-40 bg-muted/30 rounded animate-pulse" />
            ) : (
              <div className="flex items-end gap-1.5 h-40">
                {data?.financial.monthly.map((m, i) => {
                  const max = Math.max(...(data.financial.monthly.map(x => x.total)), 1);
                  const h = (m.total / max) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                      {m.total > 0 && (
                        <span className="text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {fmtUsd(m.total)}
                        </span>
                      )}
                      <div
                        title={`${m.label}: ${fmtUsd(m.total)}`}
                        className="w-full bg-green-500/80 hover:bg-green-500 rounded-t-md min-h-[2px] transition-all cursor-default"
                        style={{ height: `${Math.max(h, m.total > 0 ? 4 : 1)}%` }}
                      />
                      <span className="text-[9px] text-muted-foreground">{m.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Invoice aging */}
            <div className="rounded-xl border border-border p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Invoice Aging</p>
              {loading ? (
                <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : (
                <div className="space-y-3">
                  {data?.financial.aging.map((bucket, i) => {
                    const colors = ["bg-green-500", "bg-amber-500", "bg-orange-500", "bg-red-500"];
                    const maxAmt = Math.max(...(data.financial.aging.map(b => b.amount)), 1);
                    return (
                      <div key={bucket.bucket}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">{bucket.bucket}</span>
                          <span className="text-xs font-medium">{bucket.count} inv · {fmtUsd(bucket.amount)}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${colors[i]} transition-all duration-500`}
                            style={{ width: `${Math.max((bucket.amount / maxAmt) * 100, bucket.count > 0 ? 4 : 0)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {data?.financial.aging.every(b => b.count === 0) && (
                    <p className="text-xs text-muted-foreground text-center py-4">No unpaid invoices.</p>
                  )}
                </div>
              )}
            </div>

            {/* Top clients */}
            <div className="rounded-xl border border-border p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Top Clients by Revenue</p>
              {loading ? (
                <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
              ) : data?.financial.topClients.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No paid invoices yet.</p>
              ) : (
                <div className="space-y-2">
                  {data?.financial.topClients.map((c, i) => (
                    <div key={c.email} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-4 shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{c.name}</p>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${(c.total / (data.financial.topClients[0]?.total || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-semibold shrink-0">{fmtUsd(c.total)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Projects & Delivery ───────────────────────────────────────────── */}
        <div>
          <SectionHeader title="Projects & Delivery" sub="Project pipeline, milestone health, and overdue work" />

          {/* Projects created vs completed timeline */}
          <div className="rounded-xl border border-border p-5 mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Projects Created vs Completed (Monthly)</p>
            {loading ? (
              <div className="h-28 bg-muted/30 rounded animate-pulse" />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-2 rounded-sm bg-blue-500/60" />Created</span>
                  <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-2 rounded-sm bg-green-500" />Completed</span>
                </div>
                <div className="flex items-end gap-1.5 h-24">
                  {data?.projects.timeline.map((m, i) => {
                    const maxVal = Math.max(...(data.projects.timeline.flatMap(x => [x.created, x.completed])), 1);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end group" title={`${m.label}: ${m.created} created, ${m.completed} completed`}>
                        <div className="w-full flex items-end gap-0.5 justify-center h-full">
                          <div className="w-[45%] bg-blue-500/60 rounded-t-sm min-h-[2px]" style={{ height: `${Math.max((m.created / maxVal) * 100, m.created > 0 ? 4 : 0)}%` }} />
                          <div className="w-[45%] bg-green-500 rounded-t-sm min-h-[2px]" style={{ height: `${Math.max((m.completed / maxVal) * 100, m.completed > 0 ? 4 : 0)}%` }} />
                        </div>
                        <span className="text-[9px] text-muted-foreground">{m.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Status distribution */}
            <div className="rounded-xl border border-border p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Project Status</p>
              {loading ? (
                <div className="space-y-2.5">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-7 w-full" />)}</div>
              ) : (
                <div className="space-y-2">
                  {["discovery", "proposal", "active", "review", "complete", "paused"].map((s) => {
                    const item = data?.projects.byStatus.find(p => p.status === s);
                    const count = item?.count ?? 0;
                    const total = data?.projects.byStatus.reduce((a, b) => a + b.count, 0) || 1;
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <span className={`inline-block w-[76px] text-center text-xs px-2 py-0.5 rounded-full font-medium ${PROJECT_STATUS_COLORS[s] ?? "bg-muted text-muted-foreground"}`}>
                          {s}
                        </span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary/60 transition-all"
                            style={{ width: `${(count / total) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-5 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Milestone health + submission review */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Milestone Completion</p>
                {loading ? <Skeleton className="h-16 w-full" /> : (
                  <>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-3xl font-bold text-green-500">{data?.projects.milestones.rate ?? 0}%</span>
                      <span className="text-xs text-muted-foreground mb-1">{data?.projects.milestones.completed}/{data?.projects.milestones.total} done</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all duration-700" style={{ width: `${data?.projects.milestones.rate ?? 0}%` }} />
                    </div>
                  </>
                )}
              </div>

              <div className="rounded-xl border border-border p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Client Engagement</p>
                {loading ? <Skeleton className="h-16 w-full" /> : (
                  <div className="space-y-3">
                    {[
                      { label: "Client comments", value: data?.projects.engagement.comments ?? 0, Icon: MessageCircle, color: SEMANTIC.accent },
                      { label: "Project updates posted", value: data?.projects.engagement.updates ?? 0, Icon: FileEdit, color: SEMANTIC.info },
                    ].map(({ label, value, Icon, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 ${color}`} />
                          <span className="text-xs text-muted-foreground">{label}</span>
                        </div>
                        <span className={`text-lg font-bold ${color}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-border p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Submission Review Status</p>
                {loading ? <Skeleton className="h-16 w-full" /> : (
                  <div className="space-y-1.5">
                    {[
                      { label: "New", key: "new", color: "bg-blue-500" },
                      { label: "Reviewed", key: "reviewed", color: "bg-amber-500" },
                      { label: "Actioned", key: "actioned", color: "bg-green-500" },
                    ].map(({ label, key, color }) => {
                      const count = data?.pipeline.subsByStatus[key] ?? 0;
                      const total = Object.values(data?.pipeline.subsByStatus ?? {}).reduce((a, b) => a + b, 0) || 1;
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-16">{label}</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full ${color} rounded-full`} style={{ width: `${(count / total) * 100}%` }} />
                          </div>
                          <span className="text-xs font-medium w-5 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Conversations */}
            <div className="rounded-xl border border-border p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Conversations</p>
              {loading ? <Skeleton className="h-32 w-full" /> : (
                <div className="space-y-4">
                  {[
                    { label: "This period", value: data?.conversations.periodTotal ?? 0, color: SEMANTIC.info, Icon: BarChart2 },
                    { label: "Currently open", value: data?.conversations.openNow ?? 0, color: SEMANTIC.success, Icon: CheckCircle2 },
                    { label: "Unread messages", value: data?.conversations.unreadMessages ?? 0, color: SEMANTIC.danger, Icon: AlertTriangle },
                    { label: "Avg msgs / convo", value: data?.conversations.avgMsgsPerConv ?? 0, color: SEMANTIC.accent, Icon: MessageCircle },
                  ].map(({ label, value, color, Icon }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${color}`} />
                        <span className="text-xs text-muted-foreground">{label}</span>
                      </div>
                      <span className={`text-lg font-bold ${color}`}>{value}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Avg payment time</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold">{loading ? "—" : `${data?.financial.avgPaymentDays ?? 0} days`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Overdue projects */}
          {!loading && (data?.projects.overdueList.length ?? 0) > 0 && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 overflow-hidden">
              <div className="px-4 py-3 border-b border-red-500/15 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <p className="text-sm font-semibold text-red-500">Overdue Projects ({data?.projects.overdueList.length})</p>
              </div>
              <div className="divide-y divide-border/50">
                {data?.projects.overdueList.map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.client}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`inline-block w-[76px] text-center text-xs px-2 py-0.5 rounded-full font-medium ${PROJECT_STATUS_COLORS[p.status] ?? "bg-muted text-muted-foreground"}`}>
                        {p.status}
                      </span>
                      {p.daysOverdue !== null && (
                        <span className="text-xs font-semibold text-red-500 w-20 text-right">{p.daysOverdue}d overdue</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Content Health ────────────────────────────────────────────────── */}
        <div>
          <SectionHeader title="Content Health" sub="Published/draft ratio across all CMS entities" />
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  {["Content Type", "Total", "Published", "Draft", "Featured / Active"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="border-t border-border">
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-12" /></td>
                      ))}
                    </tr>
                  ))
                ) : (
                  [
                    { key: "blog", label: "Blog Posts" },
                    { key: "portfolio", label: "Portfolio" },
                    { key: "jobs", label: "Jobs" },
                    { key: "events", label: "Events" },
                    { key: "resources", label: "Resources" },
                    { key: "announcements", label: "Announcements" },
                  ].map(({ key, label }) => {
                    const c = data?.content[key] ?? {};
                    const pub = c.published ?? c.active ?? 0;
                    const total = c.total ?? 0;
                    const pct = total > 0 ? Math.round((pub / total) * 100) : 0;
                    return (
                      <tr key={key} className="border-t border-border hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-medium text-sm">{label}</td>
                        <td className="px-4 py-3 text-muted-foreground">{total}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs font-medium text-green-500">{pub}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{c.draft ?? c.inactive ?? 0}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{c.featured ?? (c.active !== undefined ? `${c.active} active` : "—")}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminShell>
  );
}
