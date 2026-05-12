import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { SubmissionsClient } from "./SubmissionsClient";

export default async function SubmissionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const submissions = await prisma.formSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <AdminShell title="Form Submissions">
      <SubmissionsClient submissions={submissions as any} />
    </AdminShell>
  );
}
