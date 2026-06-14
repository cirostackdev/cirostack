"use client";

import { useState, useEffect } from "react";
import { Bot, Plus, Trash2, Pencil, Zap, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AutoRule {
  id: string; name: string; trigger: string; conditions: any; action: string; actionData: any; enabled: boolean; priority: number;
}
interface AssignRule {
  id: string; name: string; type: string; criteria: any; adminIds: string[]; enabled: boolean; priority: number;
}

const TRIGGERS = [
  { value: "new-conversation", label: "New conversation" },
  { value: "offline", label: "Agent offline" },
  { value: "keyword", label: "Keyword match" },
  { value: "no-response", label: "No response timeout" },
];
const ACTIONS = [
  { value: "send-message", label: "Send message" },
  { value: "assign", label: "Assign to agent" },
  { value: "tag", label: "Add tag" },
  { value: "close", label: "Close conversation" },
];
const ASSIGN_TYPES = [
  { value: "round-robin", label: "Round Robin" },
  { value: "topic-based", label: "Topic Based" },
  { value: "load-balance", label: "Load Balance" },
];

export function AutomationClient() {
  const [tab, setTab] = useState<"automation" | "assignment">("automation");
  const [rules, setRules] = useState<AutoRule[]>([]);
  const [assignRules, setAssignRules] = useState<AssignRule[]>([]);
  const [admins, setAdmins] = useState<{ id: string; name: string }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", trigger: "new-conversation", conditions: {} as any, action: "send-message", actionData: { message: "" } as any, priority: 0 });
  const [assignForm, setAssignForm] = useState({ name: "", type: "round-robin", criteria: {} as any, adminIds: [] as string[], priority: 0 });
  const [showAssignForm, setShowAssignForm] = useState(false);

  useEffect(() => {
    fetch("/api/admin/automation").then((r) => r.ok ? r.json() : []).then(setRules);
    fetch("/api/admin/assignment-rules").then((r) => r.ok ? r.json() : []).then(setAssignRules);
    fetch("/api/admin/admins").then((r) => r.ok ? r.json() : []).then(setAdmins);
  }, []);

  const toggleRule = async (id: string, enabled: boolean) => {
    await fetch(`/api/admin/automation/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled }) });
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled } : r));
  };

  const deleteRule = async (id: string) => {
    if (!confirm("Delete this rule?")) return;
    await fetch(`/api/admin/automation/${id}`, { method: "DELETE" });
    setRules((prev) => prev.filter((r) => r.id !== id));
    toast.success("Rule deleted");
  };

  const saveRule = async () => {
    if (!form.name) return;
    const endpoint = editId ? `/api/admin/automation/${editId}` : "/api/admin/automation";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(endpoint, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) {
      const data = await res.json();
      if (editId) setRules((prev) => prev.map((r) => r.id === editId ? data : r));
      else setRules((prev) => [...prev, data]);
      toast.success(editId ? "Updated" : "Created");
      setShowForm(false); setEditId(null);
    }
  };

  const toggleAssign = async (id: string, enabled: boolean) => {
    await fetch(`/api/admin/assignment-rules/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled }) });
    setAssignRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled } : r));
  };

  const deleteAssign = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/admin/assignment-rules/${id}`, { method: "DELETE" });
    setAssignRules((prev) => prev.filter((r) => r.id !== id));
  };

  const saveAssign = async () => {
    if (!assignForm.name) return;
    const res = await fetch("/api/admin/assignment-rules", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(assignForm) });
    if (res.ok) { const data = await res.json(); setAssignRules((prev) => [...prev, data]); setShowAssignForm(false); toast.success("Created"); }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex gap-2 border-b border-border pb-3">
        <button onClick={() => setTab("automation")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "automation" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          <Bot className="w-4 h-4 inline mr-1.5" />Automation Rules
        </button>
        <button onClick={() => setTab("assignment")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "assignment" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          <Route className="w-4 h-4 inline mr-1.5" />Assignment Rules
        </button>
      </div>

      {tab === "automation" && (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Auto-reply, keyword triggers, and workflow automation.</p>
            <Button size="sm" onClick={() => { setShowForm(true); setEditId(null); setForm({ name: "", trigger: "new-conversation", conditions: {}, action: "send-message", actionData: { message: "" }, priority: 0 }); }}><Plus className="w-4 h-4 mr-1" />New Rule</Button>
          </div>

          {showForm && (
            <div className="border border-border rounded-lg p-4 space-y-4 bg-muted/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Priority</Label><Input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Trigger</Label>
                  <select value={form.trigger} onChange={(e) => setForm({ ...form, trigger: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background">
                    {TRIGGERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5"><Label>Action</Label>
                  <select value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background">
                    {ACTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>
              </div>
              {form.trigger === "keyword" && (
                <div className="space-y-1.5"><Label>Keywords (comma-separated)</Label><Input value={form.conditions.keywords?.join(", ") || ""} onChange={(e) => setForm({ ...form, conditions: { ...form.conditions, keywords: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) } })} /></div>
              )}
              {form.trigger === "no-response" && (
                <div className="space-y-1.5"><Label>Delay (minutes)</Label><Input type="number" value={form.conditions.delayMinutes || ""} onChange={(e) => setForm({ ...form, conditions: { ...form.conditions, delayMinutes: parseInt(e.target.value) || 5 } })} /></div>
              )}
              {form.action === "send-message" && (
                <div className="space-y-1.5"><Label>Message</Label><textarea value={form.actionData.message || ""} onChange={(e) => setForm({ ...form, actionData: { message: e.target.value } })} className="w-full min-h-[80px] px-3 py-2 border border-border rounded-lg text-sm resize-y bg-background" /></div>
              )}
              <div className="flex gap-2">
                <Button size="sm" onClick={saveRule}>{editId ? "Update" : "Create"}</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border">
                <button onClick={() => toggleRule(rule.id, !rule.enabled)} className={`w-9 h-5 rounded-full transition-colors shrink-0 ${rule.enabled ? "bg-primary" : "bg-muted border border-border"}`}>
                  <span className={`block w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${rule.enabled ? "ml-[18px]" : "ml-[2px]"}`} />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{rule.name}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded text-[10px] mr-1">{rule.trigger}</span>
                    → <span className="bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded text-[10px] ml-1">{rule.action}</span>
                  </p>
                </div>
                <button onClick={() => { setEditId(rule.id); setForm(rule as any); setShowForm(true); }} className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => deleteRule(rule.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            {rules.length === 0 && !showForm && <p className="text-sm text-muted-foreground text-center py-8">No automation rules yet.</p>}
          </div>
        </>
      )}

      {tab === "assignment" && (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Auto-assign conversations to agents based on rules.</p>
            <Button size="sm" onClick={() => setShowAssignForm(true)}><Plus className="w-4 h-4 mr-1" />New Rule</Button>
          </div>

          {showAssignForm && (
            <div className="border border-border rounded-lg p-4 space-y-4 bg-muted/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Name</Label><Input value={assignForm.name} onChange={(e) => setAssignForm({ ...assignForm, name: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Type</Label>
                  <select value={assignForm.type} onChange={(e) => setAssignForm({ ...assignForm, type: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background">
                    {ASSIGN_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Agents</Label>
                <div className="flex flex-wrap gap-2">
                  {admins.map((a) => (
                    <button key={a.id} onClick={() => setAssignForm({ ...assignForm, adminIds: assignForm.adminIds.includes(a.id) ? assignForm.adminIds.filter((x) => x !== a.id) : [...assignForm.adminIds, a.id] })}
                      className={`px-3 py-1.5 rounded-lg text-xs border ${assignForm.adminIds.includes(a.id) ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>{a.name}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2"><Button size="sm" onClick={saveAssign}>Create</Button><Button size="sm" variant="ghost" onClick={() => setShowAssignForm(false)}>Cancel</Button></div>
            </div>
          )}

          <div className="space-y-2">
            {assignRules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border">
                <button onClick={() => toggleAssign(rule.id, !rule.enabled)} className={`w-9 h-5 rounded-full transition-colors shrink-0 ${rule.enabled ? "bg-primary" : "bg-muted border border-border"}`}>
                  <span className={`block w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${rule.enabled ? "ml-[18px]" : "ml-[2px]"}`} />
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium">{rule.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{rule.type} • {rule.adminIds.length} agents</p>
                </div>
                <button onClick={() => deleteAssign(rule.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            {assignRules.length === 0 && !showAssignForm && <p className="text-sm text-muted-foreground text-center py-8">No assignment rules yet.</p>}
          </div>
        </>
      )}
    </div>
  );
}
