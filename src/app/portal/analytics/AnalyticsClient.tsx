"use client";

import { useState, useEffect } from "react";
import { DollarSign, FolderKanban, Receipt, TrendingUp } from "lucide-react";

interface Analytics {
  monthlySpend: { month: string; amount: number }[];
  projectsByStatus: Record<string, number>;
  totalSpend: number;
  totalProjects: number;
  totalInvoicesPaid: number;
}

export function AnalyticsClient() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/portal/analytics")
      .then((r) => r.ok ? r.json() : null)
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) return <div className="p-6 text-sm text-muted-foreground">Loading analytics...</div>;

  const maxSpend = Math.max(...data.monthlySpend.map((m) => m.amount), 1);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <DollarSign className="w-4 h-4" /><span className="text-xs">Total Spend</span>
          </div>
          <p className="text-2xl font-bold">${data.totalSpend.toLocaleString()}</p>
        </div>
        <div className="border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FolderKanban className="w-4 h-4" /><span className="text-xs">Projects</span>
          </div>
          <p className="text-2xl font-bold">{data.totalProjects}</p>
        </div>
        <div className="border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Receipt className="w-4 h-4" /><span className="text-xs">Invoices Paid</span>
          </div>
          <p className="text-2xl font-bold">{data.totalInvoicesPaid}</p>
        </div>
      </div>

      {/* Monthly spend chart */}
      <div className="border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Monthly Spend (USD)
        </h3>
        <div className="flex items-end gap-1.5 h-40">
          {data.monthlySpend.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-primary/20 rounded-t relative" style={{ height: `${(m.amount / maxSpend) * 100}%`, minHeight: m.amount > 0 ? "4px" : "1px" }}>
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground whitespace-nowrap">
                  {m.amount > 0 ? `$${m.amount}` : ""}
                </div>
              </div>
              <span className="text-[9px] text-muted-foreground">{m.month.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Projects by status */}
      <div className="border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold mb-4">Projects by Status</h3>
        <div className="space-y-2">
          {Object.entries(data.projectsByStatus).map(([status, count]) => (
            <div key={status} className="flex items-center gap-3">
              <span className="capitalize text-sm w-24">{status}</span>
              <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${(count / data.totalProjects) * 100}%` }} />
              </div>
              <span className="text-sm font-medium w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
