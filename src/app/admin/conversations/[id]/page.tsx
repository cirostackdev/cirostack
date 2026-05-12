import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConversationDetail } from "./ConversationDetail";

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: { assignedTo: { select: { id: true, name: true } } },
  });

  if (!conversation) notFound();

  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
  });

  // Mark visitor messages as read
  await prisma.message.updateMany({
    where: { conversationId: id, senderType: "visitor", read: false },
    data: { read: true },
  });

  return (
    <AdminShell>
      <ConversationDetail
        conversation={conversation as any}
        initialMessages={messages as any}
        adminId={(session.user as any).id}
        adminName={session.user.name || "Agent"}
      />
    </AdminShell>
  );
}
