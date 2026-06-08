"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeletons";
import { DollarSign, TrendingUp, ArrowUpRight, Clock } from "lucide-react";
import { SEMANTIC } from "@/lib/colors";

type Summary = {
  totalRevenue: number;
  thisMonth: number;
  lastMonth: number;
  outstanding: number;
};

type MonthlyData = {
  month: number;
  year: number;
  label: string;
  total: number;
};

type Payment = {
  id: string;
  number: string;
  amount: number;
  currency: string;
  paidAt: string;
  client: { name?: string; email: string };
};

function fmtUsd(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function RevenuePage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "thisYear" | "lastYear">("all");

  useEffect(() => {
    fetch("/api/admin/revenue")
      .then((r) => r.json())
      .then((data) => {
        setSummary(data.summary);
        setMonthly(data.monthly);
        setPayments(data.payments);
        setLoading(false);
      });
  }, []);

  const now = new Date();
  const filteredPayments = payments.filter((p) => {
    if (filter === "all") return true;
    const year = new Date(p.paidAt).getFullYear();
    if (filter === "thisYear") return year === now.getFullYear();
    return year === now.getFullYear() - 1;
  });

  const maxMonthly = Math.max(...monthly.map((m) => m.total), 1);

  const growthPct =
    summary && summary.lastMonth > 0
      ? Math.round(((summary.thisMonth - summary.lastMonth) / summary.lastMonth) * 100)
      : null;

  return (
    <AdminShell title="Revenue">
      <div className="max-w-5xl space-y-8">
        {/* Summary Cards */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <div className="h-4 w-20 bg-muted rounded animate-pulse mb-3" />
                <div className="h-8 w-28 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground font-medium">Total Revenue</p>
                <DollarSign className={`w-4 h-4 ${SEMANTIC.success}`} />
              </div>
              <p className={`text-2xl font-bold ${SEMANTIC.success}`}>{fmtUsd(summary.totalRevenue)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">All time</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground font-medium">This Month</p>
                <TrendingUp className={`w-4 h-4 ${SEMANTIC.info}`} />
              </div>
              <p className={`text-2xl font-bold ${SEMANTIC.info}`}>{fmtUsd(summary.thisMonth)}</p>
              {growthPct !== null && (
                <p className={`text-xs mt-0.5 font-medium ${growthPct >= 0 ? SEMANTIC.success : SEMANTIC.danger}`}>
                  {growthPct >= 0 ? "+" : ""}{growthPct}% vs last month
                </p>
              )}
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground font-medium">Last Month</p>
                <ArrowUpRight className={`w-4 h-4 ${SEMANTIC.accent}`} />
              </div>
              <p className={`text-2xl font-bold ${SEMANTIC.accent}`}>{fmtUsd(summary.lastMonth)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Previous month</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground font-medium">Outstanding</p>
                <Clock className={`w-4 h-4 ${SEMANTIC.warning}`} />
              </div>
              <p className={`text-2xl font-bold ${SEMANTIC.warning}`}>{fmtUsd(summary.outstanding)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Unpaid invoices</p>
            </div>
          </div>
        )}

        {/* Monthly Chart */}
        <div className="rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold mb-4">Monthly Revenue (Last 12 Months)</h2>
          {loading ? (
            <div className="h-48 bg-muted/30 rounded animate-pulse" />
          ) : (
            <div className="flex items-end gap-2 h-48">
              {monthly.map((m, i) => {
                const height = maxMonthly > 0 ? (m.total / maxMonthly) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    {m.total > 0 && (
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {fmtUsd(m.total)}
                      </span>
                    )}
                    <div
                      className="w-full bg-green-500/80 rounded-t-md min-h-[2px] transition-all"
                      style={{ height: `${Math.max(height, m.total > 0 ? 4 : 1)}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground">{m.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payment History */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-sm font-semibold">Payment History</h2>
            <div className="flex gap-2">
              {([["all", "All time"], ["thisYear", "This year"], ["lastYear", "Last year"]] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <AdminTableSkeleton cols={5} />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Invoice</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-12 text-center">
                          <p className="text-sm text-muted-foreground">No payments found for this period.</p>
                        </td>
                      </tr>
                    )}
                    {filteredPayments.map((p) => (
                      <tr key={p.id} className="border-t border-border">
                        <td className="px-4 py-3 font-medium">{p.number}</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.client.name ?? p.client.email}</td>
                        <td className="px-4 py-3 font-medium text-green-500">
                          {p.currency} {(p.amount / 100).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(p.paidAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-2">
                {filteredPayments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No payments found for this period.</p>
                )}
                {filteredPayments.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl border border-border">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm">{p.number}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.client.name ?? p.client.email}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-sm text-green-500">
                          {p.currency} {(p.amount / 100).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(p.paidAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
