import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AutomationClient } from "./AutomationClient";

export default async function AutomationPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <AdminShell title="Automation">
      <AutomationClient />
    </AdminShell>
  );
}
