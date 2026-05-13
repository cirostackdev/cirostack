import { clientAuth } from "@/auth-client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PortalSettingsClient } from "./PortalSettingsClient";
import PushPermissionBanner from "@/components/PushPermissionBanner";

export default async function PortalSettingsPage() {
  const session = await clientAuth();
  if (!session?.user) redirect("/portal/login");

  const clientId = (session.user as any).id as string;
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { name: true, email: true },
  });

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <PushPermissionBanner ownerType="client" />
      <PortalSettingsClient
        initialName={client?.name ?? ""}
        email={client?.email ?? ""}
      />
    </div>
  );
}
