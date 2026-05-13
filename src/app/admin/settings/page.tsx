import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const currentAdmin = session.user as any;
  if (currentAdmin.role !== "super") {
    return (
      <AdminShell title="Settings">
        <div className="p-6 text-sm text-muted-foreground">
          Only super admins can manage settings.
        </div>
      </AdminShell>
    );
  }

  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, disabled: true, online: true, createdAt: true },
  });

  const me = await prisma.admin.findUnique({
    where: { id: currentAdmin.id },
    select: { name: true, email: true },
  });

  return (
    <AdminShell title="Settings">
      <SettingsClient
        admins={admins as any}
        currentAdminId={currentAdmin.id}
        currentAdminName={me?.name ?? currentAdmin.name ?? ""}
        currentAdminEmail={me?.email ?? currentAdmin.email ?? ""}
      />
    </AdminShell>
  );
}
