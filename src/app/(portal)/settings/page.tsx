"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import PushPermissionBanner from "@/components/PushPermissionBanner";

export default function PortalSettingsPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/portal/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <PushPermissionBanner ownerType="client" />

      <form onSubmit={handleSave} className="space-y-4 mt-6">
        <div className="space-y-1.5">
          <Label>Display name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={session?.user?.email ?? ""} disabled className="opacity-60" />
        </div>
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
      </form>
    </div>
  );
}
