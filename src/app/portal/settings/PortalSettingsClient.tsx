"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOut } from "next-auth/react";
import { LogOut, Bell, Users, Plus, Trash2 } from "lucide-react";
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

      <NotificationPreferences />
      <TeamManagement />

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

const CATEGORY_LABELS: Record<string, string> = {
  messages: "Messages",
  invoices: "Invoices & Payments",
  projects: "Project Updates",
  files: "File Uploads",
  system: "System Notifications",
};

function NotificationPreferences() {
  const [prefs, setPrefs] = useState<{ category: string; push: boolean; email: boolean }[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/portal/notification-preferences")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setPrefs(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const toggle = (category: string, field: "push" | "email") => {
    setPrefs((prev) =>
      prev.map((p) => p.category === category ? { ...p, [field]: !p[field] } : p)
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/portal/notification-preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences: prefs }),
    });
    if (res.ok) toast.success("Notification preferences saved");
    else toast.error("Failed to save preferences");
    setSaving(false);
  };

  if (!loaded) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-5">
        <h2 className="font-semibold text-base flex items-center gap-2">
          <Bell className="w-4 h-4" /> Notification Preferences
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">Choose what notifications you receive.</p>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-[1fr_60px_60px] gap-2 text-xs font-semibold text-muted-foreground pb-2 border-b border-border">
          <span>Category</span>
          <span className="text-center">Push</span>
          <span className="text-center">Email</span>
        </div>
        {prefs.map((pref) => (
          <div key={pref.category} className="grid grid-cols-[1fr_60px_60px] gap-2 items-center">
            <span className="text-sm">{CATEGORY_LABELS[pref.category] || pref.category}</span>
            <div className="flex justify-center">
              <button
                onClick={() => toggle(pref.category, "push")}
                className={`w-9 h-5 rounded-full transition-colors ${pref.push ? "bg-primary" : "bg-muted border border-border"}`}
              >
                <span className={`block w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${pref.push ? "translate-x-4.5 ml-[18px]" : "translate-x-0.5 ml-[2px]"}`} />
              </button>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => toggle(pref.category, "email")}
                className={`w-9 h-5 rounded-full transition-colors ${pref.email ? "bg-primary" : "bg-muted border border-border"}`}
              >
                <span className={`block w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${pref.email ? "translate-x-4.5 ml-[18px]" : "translate-x-0.5 ml-[2px]"}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Button className="mt-4" size="sm" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Preferences"}
      </Button>
    </div>
  );
}

function TeamManagement() {
  const [members, setMembers] = useState<{ id: string; email: string; name: string | null; role: string; acceptedAt: string | null }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("viewer");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/portal/team").then((r) => r.ok ? r.json() : []).then(setMembers).catch(() => {});
  }, []);

  const invite = async () => {
    if (!email.trim()) return;
    setSaving(true);
    const res = await fetch("/api/portal/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), name: name.trim() || null, role }),
    });
    if (res.ok) {
      const member = await res.json();
      setMembers((prev) => [...prev, member]);
      setEmail(""); setName(""); setShowForm(false);
      toast.success("Team member invited");
    } else {
      const { error } = await res.json();
      toast.error(error || "Failed to invite");
    }
    setSaving(false);
  };

  const remove = async (memberId: string) => {
    if (!confirm("Remove this team member?")) return;
    const res = await fetch("/api/portal/team", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId }),
    });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      toast.success("Member removed");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-base flex items-center gap-2"><Users className="w-4 h-4" /> Team Members</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Invite colleagues to access your portal.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setShowForm(true)}><Plus className="w-3.5 h-3.5 mr-1" />Invite</Button>
      </div>

      {showForm && (
        <div className="border border-border rounded-lg p-3 mb-4 space-y-3 bg-muted/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" />
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (optional)" />
          </div>
          <div className="flex items-center gap-3">
            <select value={role} onChange={(e) => setRole(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background">
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
            <Button size="sm" onClick={invite} disabled={saving || !email.trim()}>{saving ? "Inviting..." : "Send Invite"}</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{m.name || m.email}</p>
              {m.name && <p className="text-xs text-muted-foreground">{m.email}</p>}
            </div>
            <span className="text-xs text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded">{m.role}</span>
            <span className="text-[10px] text-muted-foreground">{m.acceptedAt ? "Active" : "Pending"}</span>
            <button onClick={() => remove(m.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {members.length === 0 && !showForm && <p className="text-xs text-muted-foreground text-center py-4">No team members yet.</p>}
      </div>
    </div>
  );
}
