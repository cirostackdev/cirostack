import { PortalShell } from "@/components/portal/PortalShell";

export default function DashboardLoading() {
  return (
    <PortalShell title="Dashboard">
      <div className="max-w-4xl animate-pulse space-y-6">
        {/* Quick actions skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-border p-4 flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-muted" />
              <div className="h-3 w-16 bg-muted rounded" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Projects skeleton */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-3 w-14 bg-muted rounded" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-40 bg-muted rounded" />
                      <div className="h-4 w-16 bg-muted rounded-full" />
                    </div>
                    <div className="h-1.5 rounded-full bg-muted w-full" />
                    <div className="h-1.5 rounded-full bg-muted/60 w-2/3" />
                  </div>
                  <div className="w-4 h-4 bg-muted rounded shrink-0" />
                </div>
              </div>
            ))}
          </div>

          {/* Activity skeleton */}
          <div className="lg:col-span-2 space-y-3">
            <div className="h-4 w-28 bg-muted rounded mb-4" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border">
                <div className="w-8 h-8 rounded-lg bg-muted shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-24 bg-muted rounded" />
                  <div className="h-3 w-36 bg-muted rounded" />
                  <div className="h-2 w-20 bg-muted/60 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
