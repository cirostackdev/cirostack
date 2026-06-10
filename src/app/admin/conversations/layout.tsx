import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConversationsSplitLayout } from "./ConversationsSplitLayout";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const conversations = await prisma.conversation.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      assignedTo: { select: { name: true } },
    },
  });

  const unreadCounts = await prisma.message.groupBy({
    by: ["conversationId"],
    where: { senderType: "visitor", read: false },
    _count: { id: true },
  });

  const unreadMap: Record<string, number> = {};
  for (const u of unreadCounts) {
    unreadMap[u.conversationId] = u._count.id;
  }

  return (
    <AdminShell title="Conversations" noPadding noMobileHeader>
      <ConversationsSplitLayout
        initialConversations={conversations as any}
        unreadMap={unreadMap}
      >
        {children}
      </ConversationsSplitLayout>
    </AdminShell>
  );
}
