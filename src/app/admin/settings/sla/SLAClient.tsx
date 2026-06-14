"use client";

import { useEffect, useState } from "react";
import { Clock, Shield, Bell, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SLAConfig {
  id: string;
  maxFirstResponseMins: number;
  maxResolutionMins: number;
  breachNotify: boolean;
}

export function SLAClient() {
  const [config, setConfig] = useState<SLAConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [maxFirstResponse, setMaxFirstResponse] = useState(15);
  const [maxResolution, setMaxResolution] = useState(1440);
  const [breachNotify, setBreachNotify] = useState(true);

  useEffect(() => {
    fetch("/api/admin/sla")
      .then((r) => r.json())
      .then((data) => {
        setConfig(data);
        setMaxFirstResponse(data.maxFirstResponseMins);
        setMaxResolution(data.maxResolutionMins);
        setBreachNotify(data.breachNotify);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load SLA config");
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/admin/sla", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        maxFirstResponseMins: maxFirstResponse,
        maxResolutionMins: maxResolution,
        breachNotify,
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      setConfig(updated);
      toast.success("SLA configuration saved");
    } else {
      toast.error("Failed to save SLA config");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-xl space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-40 bg-muted animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Configure Service Level Agreement thresholds for response and resolution times.
          Conversations that exceed these thresholds will be flagged as SLA breaches.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* First Response Time */}
        <div className="p-4 border border-border rounded-xl bg-muted/10 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-semibold">First Response Time</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Maximum time (in minutes) before an agent should first respond to a new conversation.
          </p>
          <div>
            <Label className="text-xs text-muted-foreground block mb-1">Max first response (minutes)</Label>
            <Input
              type="number"
              min={1}
              value={maxFirstResponse}
              onChange={(e) => setMaxFirstResponse(parseInt(e.target.value) || 1)}
              className="text-sm w-32"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Current: {maxFirstResponse} min ({maxFirstResponse >= 60 ? `${(maxFirstResponse / 60).toFixed(1)} hours` : `${maxFirstResponse} minutes`})
          </p>
        </div>

        {/* Resolution Time */}
        <div className="p-4 border border-border rounded-xl bg-muted/10 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <h3 className="text-sm font-semibold">Resolution Time</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Maximum time (in minutes) before a conversation should be resolved.
          </p>
          <div>
            <Label className="text-xs text-muted-foreground block mb-1">Max resolution time (minutes)</Label>
            <Input
              type="number"
              min={1}
              value={maxResolution}
              onChange={(e) => setMaxResolution(parseInt(e.target.value) || 1)}
              className="text-sm w-32"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Current: {maxResolution} min ({maxResolution >= 60 ? `${(maxResolution / 60).toFixed(1)} hours` : `${maxResolution} minutes`})
          </p>
        </div>

        {/* Breach Notifications */}
        <div className="p-4 border border-border rounded-xl bg-muted/10 space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold">Breach Notifications</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Send notifications when an SLA threshold is breached.
          </p>
          <label className="flex items-center gap-3 cursor-pointer">
            <button
              type="button"
              role="switch"
              aria-checked={breachNotify}
              onClick={() => setBreachNotify(!breachNotify)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${
                breachNotify ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                  breachNotify ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-sm">{breachNotify ? "Enabled" : "Disabled"}</span>
          </label>
        </div>

        <Button type="submit" disabled={saving} className="gap-2">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Configuration"}
        </Button>
      </form>
    </div>
  );
}
