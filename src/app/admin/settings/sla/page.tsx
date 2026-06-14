import { AdminShell } from "@/components/admin/AdminShell";
import { SLAClient } from "./SLAClient";

export default function SLASettingsPage() {
  return (
    <AdminShell title="SLA Configuration">
      <SLAClient />
    </AdminShell>
  );
}
