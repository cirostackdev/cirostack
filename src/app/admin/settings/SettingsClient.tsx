"use client";

import { useState } from "react";
import { format } from "date-fns";
import { UserPlus, ShieldCheck, User, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  disabled: boolean;
  online: boolean;
  createdAt: string;
}

export function SettingsClient({
  admins: initial,
  currentAdminId,
  currentAdminName,
  currentAdminEmail,
}: {
  admins: Admin[];
  currentAdminId: string;
  currentAdminName: string;
  currentAdminEmail: string;
}) {
  const [admins, setAdmins] = useState<Admin[]>(initial);

  // New admin form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "agent" });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  // Profile form
  const [profileName, setProfileName] = useState(currentAdminName);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  const createAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);
    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setFormError(data.error || "Failed to create admin."); return; }
    setAdmins((prev) => [...prev, data.admin]);
    setShowForm(false);
    setForm({ name: "", email: "", password: "", role: "agent" });
    toast.success("Admin account created");
  };

  const toggleDisabled = async (id: string, disabled: boolean) => {
    const res = await fetch(`/api/admin/admins/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disabled }),
    });
    if (res.ok) {
      setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, disabled } : a)));
      toast.success(disabled ? "Admin disabled" : "Admin enabled");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw && newPw !== confirmPw) { toast.error("New passwords do not match"); return; }
    setProfileSaving(true);
    const body: Record<string, string> = {};
    if (profileName && profileName !== currentAdminName) body.name = profileName;
    if (newPw) { body.currentPassword = currentPw; body.newPassword = newPw; }

    if (Object.keys(body).length === 0) { toast.info("Nothing to update"); setProfileSaving(false); return; }

    const res = await fetch("/api/admin/admins/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setProfileSaving(false);
    if (!res.ok) { toast.error(data.error ?? "Failed to save"); return; }
    toast.success("Profile updated");
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
  };

  return (
    <div className="max-w-2xl space-y-8">

      {/* My Profile */}
      <div>
        <h2 className="text-sm font-semibold mb-3">My Profile</h2>
        <form onSubmit={handleSaveProfile} className="p-4 border border-border rounded-xl bg-muted/10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground block mb-1">Name</Label>
              <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} className="text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground block mb-1">Email</Label>
              <Input value={currentAdminEmail} disabled className="text-sm opacity-60" />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Change Password</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground block mb-1">Current password</Label>
                <Input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground block mb-1">New password</Label>
                <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground block mb-1">Confirm new</Label>
                <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="text-sm" />
              </div>
            </div>
          </div>
          <Button type="submit" size="sm" disabled={profileSaving}>{profileSaving ? "Saving…" : "Save Profile"}</Button>
        </form>
      </div>

      {/* Admin accounts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold">Admin Accounts</p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 text-sm px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <UserPlus className="w-4 h-4" />
            Add admin
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <form onSubmit={createAdmin} className="mb-4 p-4 border border-border rounded-xl bg-muted/20 space-y-3">
            <p className="text-sm font-semibold">New admin account</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Name</label>
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Email</label>
                <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Password</label>
                <input required type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Role</label>
                <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary">
                  <option value="agent">Agent</option>
                  <option value="super">Super admin</option>
                </select>
              </div>
            </div>
            {formError && <p className="text-xs text-red-500">{formError}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50">
                {loading ? "Creating…" : "Create"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm bg-muted rounded-lg hover:bg-muted/80">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Admin list */}
        <div className="space-y-2">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center gap-3 p-3 border border-border rounded-xl">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                  {admin.role === "super" ? (
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  ) : (
                    <User className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <Circle className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${admin.online ? "fill-green-500 text-green-500" : "fill-muted text-muted"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-sm font-medium truncate">{admin.name}</p>
                  {admin.id === currentAdminId && <span className="text-xs text-muted-foreground shrink-0">(you)</span>}
                  <span className="text-xs text-muted-foreground capitalize shrink-0">{admin.role}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{admin.email}</p>
              </div>
              {admin.id !== currentAdminId && (
                <button
                  onClick={() => toggleDisabled(admin.id, !admin.disabled)}
                  className={`shrink-0 text-xs px-3 py-2 min-h-[36px] rounded-lg font-medium transition-colors ${
                    admin.disabled
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  }`}
                >
                  {admin.disabled ? "Enable" : "Disable"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
