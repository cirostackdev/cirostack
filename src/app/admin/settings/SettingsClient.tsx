"use client";

import { useState } from "react";
import { format } from "date-fns";
import { UserPlus, ShieldCheck, User, Circle } from "lucide-react";

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
}: {
  admins: Admin[];
  currentAdminId: string;
}) {
  const [admins, setAdmins] = useState<Admin[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "agent" });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!res.ok) {
      setFormError(data.error || "Failed to create admin.");
      return;
    }
    setAdmins((prev) => [...prev, data.admin]);
    setShowForm(false);
    setForm({ name: "", email: "", password: "", role: "agent" });
  };

  const toggleDisabled = async (id: string, disabled: boolean) => {
    const res = await fetch(`/api/admin/admins/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disabled }),
    });
    if (res.ok) {
      setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, disabled } : a)));
    }
  };

  return (
    <div className="p-4 max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">Manage admin accounts</p>
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
        <form
          onSubmit={createAdmin}
          className="mb-4 p-4 border border-border rounded-xl bg-muted/20 space-y-3"
        >
          <p className="text-sm font-semibold">New admin account</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Password</label>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="agent">Agent</option>
                <option value="super">Super admin</option>
              </select>
            </div>
          </div>
          {formError && <p className="text-xs text-red-500">{formError}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm bg-muted rounded-lg hover:bg-muted/80"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Admin list */}
      <div className="space-y-2">
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="flex items-center justify-between p-3 border border-border rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                  {admin.role === "super" ? (
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  ) : (
                    <User className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <Circle
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${
                    admin.online ? "fill-green-500 text-green-500" : "fill-muted text-muted"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {admin.name}
                  {admin.id === currentAdminId && (
                    <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{admin.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground capitalize">{admin.role}</span>
              {admin.id !== currentAdminId && (
                <button
                  onClick={() => toggleDisabled(admin.id, !admin.disabled)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    admin.disabled
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  }`}
                >
                  {admin.disabled ? "Enable" : "Disable"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
