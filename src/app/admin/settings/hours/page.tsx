import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { BusinessHoursClient } from "./BusinessHoursClient";

export default async function BusinessHoursPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <AdminShell title="Business Hours">
      <BusinessHoursClient />
    </AdminShell>
  );
}
