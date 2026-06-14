import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { CannedResponsesClient } from "./CannedResponsesClient";

export default async function CannedResponsesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const responses = await prisma.cannedResponse.findMany({
    orderBy: { title: "asc" },
  });

  return (
    <AdminShell title="Canned Responses">
      <CannedResponsesClient initialResponses={responses as any} />
    </AdminShell>
  );
}
