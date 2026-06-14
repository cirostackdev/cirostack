import { clientAuth } from "@/auth-client";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/PortalShell";
import { AnalyticsClient } from "./AnalyticsClient";

export default async function PortalAnalyticsPage() {
  const session = await clientAuth();
  if (!session?.user) redirect("/portal/login");

  return (
    <PortalShell title="Analytics">
      <AnalyticsClient />
    </PortalShell>
  );
}
