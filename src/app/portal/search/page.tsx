import { clientAuth } from "@/auth-client";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/PortalShell";
import { SearchClient } from "./SearchClient";

export default async function PortalSearchPage() {
  const session = await clientAuth();
  if (!session?.user) redirect("/portal/login");

  return (
    <PortalShell title="Search">
      <SearchClient />
    </PortalShell>
  );
}
