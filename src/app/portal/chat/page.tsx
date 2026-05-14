import { clientAuth } from "@/auth-client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PortalShell } from "@/components/portal/PortalShell";
import { PortalChatClient } from "./PortalChatClient";

export default async function PortalChatPage() {
  const session = await clientAuth();
  if (!session?.user) redirect("/portal/login");

  const clientId = (session.user as any).id as string;

  const [client, conversation] = await Promise.all([
    prisma.client.findUnique({
      where: { id: clientId },
      select: { name: true, email: true },
    }),
    prisma.conversation.findFirst({
      where: { visitorId: clientId, status: "open" },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        assignedTo: { select: { name: true } },
      },
    }),
  ]);

  return (
    <PortalShell title="Messages">
      <div className="h-full -m-4 md:-m-6">
        <PortalChatClient
          clientId={clientId}
          clientName={client?.name ?? session.user.name ?? ""}
          clientEmail={client?.email ?? session.user.email ?? ""}
          initialConversation={conversation as any}
        />
      </div>
    </PortalShell>
  );
}
