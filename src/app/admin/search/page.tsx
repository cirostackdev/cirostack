import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { SearchClient } from "./SearchClient";

export default async function SearchPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <AdminShell title="Search">
      <SearchClient />
    </AdminShell>
  );
}
