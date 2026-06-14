import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { WidgetConfigClient } from "./WidgetConfigClient";

export default async function WidgetConfigPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <AdminShell title="Widget Configuration">
      <WidgetConfigClient />
    </AdminShell>
  );
}
