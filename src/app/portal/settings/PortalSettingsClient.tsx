"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function PortalSettingsClient({
  initialName,
  email,
}: {
  initialName: string;
  email: string;
}) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);

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
    <div className="mt-6 rounded-2xl border border-border bg-card p-6">
      <div className="mb-5">
        <h2 className="font-semibold text-base">Profile</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Update your display name visible to the team.</p>
      </div>
      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="display-name">Display name</Label>
            <Input
              id="display-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email-field">Email address</Label>
            <Input
              id="email-field"
              value={email}
              disabled
              className="opacity-60 cursor-not-allowed"
            />
            <p className="text-[11px] text-muted-foreground">Email cannot be changed here.</p>
          </div>
        </div>
        <div className="pt-1">
          <Button type="submit" disabled={saving} className="min-w-[120px]">
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-border">
        <h2 className="font-semibold text-base mb-1">Session</h2>
        <p className="text-sm text-muted-foreground mb-4">Sign out of your client portal account.</p>
        <Button
          variant="destructive"
          onClick={() => signOut({ callbackUrl: "/portal/login" })}
        >
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );
}
