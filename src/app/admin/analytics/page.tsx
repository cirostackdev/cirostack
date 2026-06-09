"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area, BarChart, LineChart, FunnelChart, Funnel, LabelList,
} from "recharts";
import { AdminShell } from "@/components/admin/AdminShell";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DollarSign, Users, TrendingUp, FolderKanban, AlertTriangle,
  Clock, CheckCircle2, BarChart2, MessageCircle, FileEdit,
} from "lucide-react";
import { PROJECT_STATUS_COLORS, SEMANTIC } from "@/lib/colors";

// ── Types ────────────────────────────────────────────────────────────────────

type TrendPoint = { label: string; revenue: number; leads: number; submissions: number; projects: number; conversations: number };

type AnalyticsData = {
  meta: { days: number };
  trends: TrendPoint[];
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

function PeriodSelect({ days, onChange }: { days: number; onChange: (v: number) => void }) {
  return (
    <Select value={String(days)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger className="h-7 w-[130px] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7">Last 7 days</SelectItem>
        <SelectItem value="30">Last 30 days</SelectItem>
        <SelectItem value="90">Last 90 days</SelectItem>
        <SelectItem value="365">Last 12 months</SelectItem>
      </SelectContent>
    </Select>
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
  const [tab, setTab] = useState<"overview" | "pipeline" | "financial" | "projects" | "content">("overview");
  const [activeSeries, setActiveSeries] = useState(["revenue", "leads", "submissions", "projects", "conversations"]);
  const toggleSeries = (key: string) => setActiveSeries(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

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

  const TABS = [
    { key: "overview",  label: "Overview" },
    { key: "pipeline",  label: "Pipeline" },
    { key: "financial", label: "Financial" },
    { key: "projects",  label: "Projects" },
    { key: "content",   label: "Content" },
  ] as const;

  return (
    <AdminShell title="Analytics">
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-500 text-sm">
          Failed to load analytics: {error}
        </div>
      )}
      <div className="space-y-6">

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border overflow-x-auto scrollbar-none">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`shrink-0 px-3 sm:px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Overview tab ─────────────────────────────────────────────────── */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Period selector inline */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Period:</span>
              <PeriodSelect days={days} onChange={setDays} />
              {loading && <span className="text-xs text-muted-foreground">Loading…</span>}
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { label: "Revenue", value: loading ? null : fmtUsd(data?.kpis.periodRevenue ?? 0), icon: DollarSign, color: SEMANTIC.success },
                { label: "New Leads", value: loading ? null : String(data?.kpis.periodLeads ?? 0), icon: Users, color: SEMANTIC.accent },
                { label: "Win Rate", value: loading ? null : `${data?.kpis.conversionRate ?? 0}%`, icon: TrendingUp, color: SEMANTIC.info },
                { label: "New Clients", value: loading ? null : String(data?.kpis.newClients ?? 0), icon: FolderKanban, color: SEMANTIC.emphasis },
                { label: "Overdue Inv.", value: loading ? null : String(data?.kpis.overdueInvoices ?? 0), icon: AlertTriangle, color: SEMANTIC.danger },
              ].map(({ label, value, icon: Icon, color }, i, arr) => (
                <div key={label} className={`rounded-xl border border-border p-4 ${i === arr.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}>
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

            {/* Business Trends */}
            <div>
              <SectionHeader title="Business Trends" sub="How key metrics relate and move together over the last 12 months" />
              <div className="rounded-xl border border-border p-5">
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  {([
                    { key: "revenue",       label: "Revenue",       dot: "bg-green-500",  active: "bg-green-500/15 text-green-500" },
                    { key: "leads",         label: "Leads",         dot: "bg-purple-500", active: "bg-purple-500/15 text-purple-500" },
                    { key: "submissions",   label: "Submissions",   dot: "bg-blue-500",   active: "bg-blue-500/15 text-blue-500" },
                    { key: "projects",      label: "Projects",      dot: "bg-amber-500",  active: "bg-amber-500/15 text-amber-500" },
                    { key: "conversations", label: "Conversations", dot: "bg-orange-500", active: "bg-orange-500/15 text-orange-500" },
                  ] as { key: string; label: string; dot: string; active: string }[]).map((s) => (
                    <button
                      key={s.key}
                      onClick={() => toggleSeries(s.key)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                        activeSeries.includes(s.key)
                          ? `${s.active} border-transparent`
                          : "bg-transparent text-muted-foreground border-border opacity-40 hover:opacity-70"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${activeSeries.includes(s.key) ? s.dot : "bg-muted-foreground"}`} />
                      {s.label}
                    </button>
                  ))}
                </div>
                {loading ? (
                  <div className="h-64 bg-muted/30 rounded animate-pulse" />
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <ComposedChart data={data?.trends ?? []} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="rev" orientation="left" tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : v > 0 ? `$${v}` : "0"} width={36} />
                      <YAxis yAxisId="cnt" orientation="right" tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
                      <Tooltip
                        cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }}
                        labelStyle={{ color: "#a1a1aa", marginBottom: 4 }}
                        formatter={(value: any, name: string) => name === "Revenue" ? [fmtUsd(value), name] : [value, name]}
                      />
                      {activeSeries.includes("revenue") && (
                        <Bar yAxisId="rev" dataKey="revenue" name="Revenue" fill="#22c55e" fillOpacity={0.5} radius={[3, 3, 0, 0]} />
                      )}
                      {activeSeries.includes("leads") && (
                        <Line yAxisId="cnt" type="monotone" dataKey="leads" name="Leads" stroke="#a855f7" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                      )}
                      {activeSeries.includes("submissions") && (
                        <Line yAxisId="cnt" type="monotone" dataKey="submissions" name="Submissions" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                      )}
                      {activeSeries.includes("projects") && (
                        <Line yAxisId="cnt" type="monotone" dataKey="projects" name="Projects" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                      )}
                      {activeSeries.includes("conversations") && (
                        <Line yAxisId="cnt" type="monotone" dataKey="conversations" name="Conversations" stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                      )}
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
                <p className="text-[10px] text-muted-foreground mt-2 text-right">Left axis: revenue · Right axis: counts · Always shows last 12 months</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Pipeline tab ─────────────────────────────────────────────────── */}
        {tab === "pipeline" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <SectionHeader title="Business Pipeline" sub="End-to-end funnel from submission to won client" />
              <div className="flex items-center gap-2 shrink-0 -mt-4">
                <span className="text-xs text-muted-foreground">Period:</span>
                <PeriodSelect days={days} onChange={setDays} />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Funnel */}
              <div className="rounded-xl border border-border p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Acquisition Funnel</p>
                {loading ? (
                  <div className="h-44 bg-muted/30 rounded animate-pulse" />
                ) : (
                  <ResponsiveContainer width="100%" height={176}>
                    <FunnelChart>
                      <Tooltip
                        cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }}
                        formatter={(v: any, _: any, props: any) => {
                          const base = data?.pipeline.funnel.submissions || 1;
                          const pct = Math.round((v / base) * 100);
                          return [`${v} (${pct}%)`, props.payload.name];
                        }}
                      />
                      <Funnel dataKey="value" isAnimationActive data={[
                        { name: "Submissions", value: data?.pipeline.funnel.submissions ?? 0, fill: "#3b82f6" },
                        { name: "Leads",       value: data?.pipeline.funnel.leads ?? 0,       fill: "#a855f7" },
                        { name: "Qualified",   value: data?.pipeline.funnel.qualified ?? 0,   fill: "#f59e0b" },
                        { name: "Won",         value: data?.pipeline.funnel.won ?? 0,         fill: "#22c55e" },
                      ]}>
                        <LabelList dataKey="name" position="insideTop" fill="#fff" fontSize={11} fontWeight={500} />
                        <LabelList dataKey="value" position="insideBottom" fill="rgba(255,255,255,0.7)" fontSize={11} />
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
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
                <ResponsiveContainer width="100%" height={112}>
                  <BarChart data={data?.pipeline.leadVelocity} barGap={2} margin={{ top: 0, right: 8, bottom: 0, left: -24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 9, fill: "#71717a" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "#71717a" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#a1a1aa" }} />
                    <Bar dataKey="new" name="New" fill="#a855f7" fillOpacity={0.75} radius={[3, 3, 0, 0]} />
                    <Bar dataKey="won" name="Won" fill="#10b981" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
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
        )}

        {/* ── Financial tab ────────────────────────────────────────────────── */}
        {tab === "financial" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <SectionHeader title="Financial Health" sub="Revenue, invoice aging, and client value" />
              <div className="flex items-center gap-2 shrink-0 -mt-4">
                <span className="text-xs text-muted-foreground">Period:</span>
                <PeriodSelect days={days} onChange={setDays} />
              </div>
            </div>

            {/* Revenue chart */}
            <div className="rounded-xl border border-border p-5 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
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
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={data?.financial.monthly} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : v > 0 ? `$${v}` : "0"} width={40} />
                    <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#a1a1aa" }} formatter={(v: any) => [fmtUsd(v), "Revenue"]} />
                    <Area type="monotone" dataKey="total" name="Revenue" stroke="#22c55e" strokeWidth={2} fill="url(#revenueGradient)" dot={false} activeDot={{ r: 4, fill: "#22c55e" }} />
                  </AreaChart>
                </ResponsiveContainer>
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
        )}

        {/* ── Projects tab ─────────────────────────────────────────────────── */}
        {tab === "projects" && (
          <div>
            <SectionHeader title="Projects & Delivery" sub="Project pipeline, milestone health, and overdue work" />

            {/* Projects created vs completed timeline */}
            <div className="rounded-xl border border-border p-5 mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Projects Created vs Completed (Monthly)</p>
              {loading ? (
                <div className="h-28 bg-muted/30 rounded animate-pulse" />
              ) : (
                <ResponsiveContainer width="100%" height={112}>
                  <LineChart data={data?.projects.timeline} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#71717a" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "#71717a" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#a1a1aa" }} />
                    <Line type="monotone" dataKey="created" name="Created" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                    <Line type="monotone" dataKey="completed" name="Completed" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
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
                    {([
                      { s: "discovery", bar: "bg-blue-500" },
                      { s: "proposal",  bar: "bg-amber-500" },
                      { s: "active",    bar: "bg-green-500" },
                      { s: "review",    bar: "bg-purple-500" },
                      { s: "complete",  bar: "bg-muted-foreground" },
                      { s: "paused",    bar: "bg-orange-500" },
                    ] as { s: string; bar: string }[]).map(({ s, bar }) => {
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
                              className={`h-full rounded-full ${bar} transition-all`}
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
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-3 shrink-0">
                        <span className={`inline-block w-[76px] text-center text-xs px-2 py-0.5 rounded-full font-medium ${PROJECT_STATUS_COLORS[p.status] ?? "bg-muted text-muted-foreground"}`}>
                          {p.status}
                        </span>
                        {p.daysOverdue !== null && (
                          <span className="text-xs font-semibold text-red-500 text-right">{p.daysOverdue}d overdue</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Content tab ──────────────────────────────────────────────────── */}
        {tab === "content" && (
          <div>
            <SectionHeader title="Content Health" sub="Published/draft ratio across all CMS entities" />
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[480px]">
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
        )}

      </div>
    </AdminShell>
  );
}
