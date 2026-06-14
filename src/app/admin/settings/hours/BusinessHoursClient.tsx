"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TIMEZONES = ["UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "Europe/London", "Europe/Paris", "Asia/Tokyo", "Asia/Shanghai", "Australia/Sydney", "Africa/Lagos"];

interface HourEntry {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
  timezone: string;
}

export function BusinessHoursClient() {
  const [hours, setHours] = useState<HourEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/business-hours")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setHours(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const update = (day: number, field: string, value: any) => {
    setHours((prev) => prev.map((h) => h.day === day ? { ...h, [field]: value } : h));
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/business-hours", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hours }),
    });
    if (res.ok) toast.success("Business hours saved");
    else toast.error("Failed to save");
    setSaving(false);
  };

  if (!loaded) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" /> Business Hours
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Set your availability. Visitors will see an offline message outside these hours.
        </p>
      </div>

      {hours.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm font-medium">Timezone:</label>
            <select
              value={hours[0]?.timezone || "UTC"}
              onChange={(e) => setHours((prev) => prev.map((h) => ({ ...h, timezone: e.target.value })))}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background"
            >
              {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>

          {hours.map((h) => (
            <div key={h.day} className="flex items-center gap-3 py-2 px-3 rounded-lg border border-border">
              <button
                onClick={() => update(h.day, "enabled", !h.enabled)}
                className={`w-10 h-5 rounded-full transition-colors shrink-0 ${h.enabled ? "bg-primary" : "bg-muted border border-border"}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform ${h.enabled ? "ml-[22px]" : "ml-[2px]"}`} />
              </button>
              <span className="w-24 text-sm font-medium">{DAYS[h.day]}</span>
              <Input
                type="time"
                value={h.startTime}
                onChange={(e) => update(h.day, "startTime", e.target.value)}
                disabled={!h.enabled}
                className="w-28 text-sm"
              />
              <span className="text-muted-foreground text-sm">to</span>
              <Input
                type="time"
                value={h.endTime}
                onChange={(e) => update(h.day, "endTime", e.target.value)}
                disabled={!h.enabled}
                className="w-28 text-sm"
              />
            </div>
          ))}
        </div>
      )}

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Business Hours"}
      </Button>
    </div>
  );
}
