import { PortalShell } from "@/components/portal/PortalShell";

export default function ProjectsLoading() {
  return (
    <PortalShell title="Projects">
      <div className="max-w-3xl animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-48 bg-muted rounded" />
                  <div className="h-4 w-16 bg-muted rounded-full" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <div className="h-3 w-20 bg-muted rounded" />
                    <div className="h-3 w-8 bg-muted rounded" />
                  </div>
                  <div className="h-1.5 rounded-full bg-muted w-full" />
                </div>
                <div className="flex gap-3">
                  <div className="h-3 w-16 bg-muted rounded" />
                  <div className="h-3 w-12 bg-muted rounded" />
                </div>
              </div>
              <div className="w-4 h-4 bg-muted rounded shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </PortalShell>
  );
}
