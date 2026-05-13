import { clientAuth } from "@/auth-client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PortalSettingsClient } from "./PortalSettingsClient";
import PushPermissionBanner from "@/components/PushPermissionBanner";
import { PortalShell } from "@/components/portal/PortalShell";

export default async function PortalSettingsPage() {
  const session = await clientAuth();
  if (!session?.user) redirect("/portal/login");

  const clientId = (session.user as any).id as string;
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { name: true, email: true },
  });

  return (
    <PortalShell title="Settings">
      <div className="max-w-xl">
        <PushPermissionBanner ownerType="client" />
        <PortalSettingsClient
          initialName={client?.name ?? ""}
          email={client?.email ?? ""}
        />
      </div>
    </PortalShell>
  );
}
