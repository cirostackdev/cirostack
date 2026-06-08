"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function PortalSettingsClient({
  initialName,
  email,
}: {
  initialName: string;
  email: string;
}) {
  const name = initialName;

  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-6">
      <div className="mb-5">
        <h2 className="font-semibold text-base">Profile</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Your account information.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Display name</Label>
          <Input value={name} disabled className="opacity-70 cursor-not-allowed" />
        </div>
        <div className="space-y-1.5">
          <Label>Email address</Label>
          <Input value={email} disabled className="opacity-70 cursor-not-allowed" />
        </div>
      </div>

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
