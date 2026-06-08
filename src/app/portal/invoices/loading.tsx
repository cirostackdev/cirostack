import { PortalShell } from "@/components/portal/PortalShell";

export default function InvoicesLoading() {
  return (
    <PortalShell title="Invoices">
      <div className="max-w-3xl animate-pulse">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-border p-4 space-y-2">
              <div className="h-3 w-16 bg-muted rounded" />
              <div className="h-7 w-28 bg-muted rounded" />
            </div>
          ))}
        </div>

        {/* Invoice rows */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-border gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-36 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-6 w-16 bg-muted rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
