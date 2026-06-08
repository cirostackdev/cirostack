"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { KeyRound, Eye, EyeOff } from "lucide-react";

export function SetPasswordModal() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  if (done) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/portal/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Failed");
      }
      toast.success("Password set! You can now use it to sign in.");
      setDone(true);
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl p-6 md:p-8">
        {/* Icon + heading */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <KeyRound className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Set your password</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">
            Create a password so you can sign in quickly next time without needing an email code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-password">Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                autoFocus
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? "Saving…" : "Set Password"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDone(true)}
              disabled={saving}
            >
              Skip
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
