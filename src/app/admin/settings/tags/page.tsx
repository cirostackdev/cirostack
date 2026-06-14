import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { TagsClient } from "./TagsClient";

export default async function TagsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const tags = await prisma.conversationTag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { conversations: true } } },
  });

  return (
    <AdminShell title="Conversation Tags">
      <TagsClient initialTags={tags as any} />
    </AdminShell>
  );
}
