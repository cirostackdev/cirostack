"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export function PortalSettingsClient({
  initialName,
  email,
}: {
  initialName: string;
  email: string;
}) {
  const [name, setName] = useState(initialName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    const nameChanged = name !== initialName;
    const passwordFilled = !!newPassword;

    if (!nameChanged && !passwordFilled) {
      toast.error("Nothing to save");
      return;
    }
    if (passwordFilled && newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordFilled && newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSaving(true);
    try {
      if (nameChanged) {
        const res = await fetch("/api/portal/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        if (res.ok) {
          toast.success("Display name updated");
        } else {
          const { error } = await res.json();
          toast.error(error ?? "Failed to update name");
        }
      }
      if (passwordFilled) {
        const res = await fetch("/api/portal/auth/set-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword, currentPassword }),
        });
        if (res.ok) {
          toast.success("Password updated");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          const { error } = await res.json();
          toast.error(error ?? "Failed to update password");
        }
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 space-y-6">
      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5">
            <h2 className="font-semibold text-base">Profile</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Your account information.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Display name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your display name" />
            </div>
            <div className="space-y-1.5">
              <Label>Email address</Label>
              <Input value={email} disabled className="opacity-70 cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5">
            <h2 className="font-semibold text-base">Change Password</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Update your portal login password.</p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Current password</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                />
              </div>
              <div className="space-y-1.5">
                <Label>New password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Confirm new password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                />
              </div>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>

      <div className="rounded-2xl border border-border bg-card p-6">
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
