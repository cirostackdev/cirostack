"use client";

import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const PRESET_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f97316", "#22c55e", "#06b6d4", "#3b82f6", "#1f2937"];

interface WidgetConfig {
  primaryColor: string;
  position: string;
  welcomeMessage: string;
  offlineMessage: string;
  preChatForm: boolean;
  preChatFields: { name: string; label: string; type: string; required: boolean }[] | null;
  showBranding: boolean;
  autoOpenDelay: number | null;
}

export function WidgetConfigClient() {
  const [config, setConfig] = useState<WidgetConfig>({
    primaryColor: "#6366f1",
    position: "bottom-right",
    welcomeMessage: "Hi! How can we help you?",
    offlineMessage: "We're currently offline. Leave a message and we'll get back to you.",
    preChatForm: false,
    preChatFields: null,
    showBranding: true,
    autoOpenDelay: null,
  });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/widget-config")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setConfig(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/widget-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    if (res.ok) toast.success("Widget configuration saved");
    else toast.error("Failed to save");
    setSaving(false);
  };

  if (!loaded) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5" /> Widget Configuration
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Customize how the chat widget looks and behaves on your site.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-6">
          {/* Color */}
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button key={c} onClick={() => setConfig({ ...config, primaryColor: c })}
                  className={`w-8 h-8 rounded-full border-2 ${config.primaryColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }} />
              ))}
              <Input type="color" value={config.primaryColor} onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })} className="w-8 h-8 p-0 border-0 cursor-pointer" />
            </div>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label>Position</Label>
            <div className="flex gap-2">
              {["bottom-right", "bottom-left"].map((pos) => (
                <button key={pos} onClick={() => setConfig({ ...config, position: pos })}
                  className={`px-4 py-2 rounded-lg text-sm border ${config.position === pos ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>
                  {pos === "bottom-right" ? "Bottom Right" : "Bottom Left"}
                </button>
              ))}
            </div>
          </div>

          {/* Welcome message */}
          <div className="space-y-2">
            <Label>Welcome Message</Label>
            <textarea value={config.welcomeMessage} onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
              className="w-full min-h-[80px] px-3 py-2 border border-border rounded-lg bg-background text-sm resize-y focus:ring-1 focus:ring-primary focus:outline-none" />
          </div>

          {/* Offline message */}
          <div className="space-y-2">
            <Label>Offline Message</Label>
            <textarea value={config.offlineMessage} onChange={(e) => setConfig({ ...config, offlineMessage: e.target.value })}
              className="w-full min-h-[80px] px-3 py-2 border border-border rounded-lg bg-background text-sm resize-y focus:ring-1 focus:ring-primary focus:outline-none" />
          </div>

          {/* Pre-chat form */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Pre-Chat Form</Label>
              <p className="text-xs text-muted-foreground">Ask for name/email before starting chat</p>
            </div>
            <button onClick={() => setConfig({ ...config, preChatForm: !config.preChatForm })}
              className={`w-10 h-5 rounded-full transition-colors ${config.preChatForm ? "bg-primary" : "bg-muted border border-border"}`}>
              <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform ${config.preChatForm ? "ml-[22px]" : "ml-[2px]"}`} />
            </button>
          </div>

          {/* Branding */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Branding</Label>
              <p className="text-xs text-muted-foreground">Display "Powered by" in widget</p>
            </div>
            <button onClick={() => setConfig({ ...config, showBranding: !config.showBranding })}
              className={`w-10 h-5 rounded-full transition-colors ${config.showBranding ? "bg-primary" : "bg-muted border border-border"}`}>
              <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform ${config.showBranding ? "ml-[22px]" : "ml-[2px]"}`} />
            </button>
          </div>

          {/* Auto-open delay */}
          <div className="space-y-2">
            <Label>Auto-open Delay (ms)</Label>
            <Input type="number" value={config.autoOpenDelay ?? ""} placeholder="Leave empty to disable"
              onChange={(e) => setConfig({ ...config, autoOpenDelay: e.target.value ? parseInt(e.target.value) : null })} />
          </div>

          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Configuration"}</Button>
        </div>

        {/* Live Preview */}
        <div className="hidden lg:block">
          <Label className="mb-3 block">Preview</Label>
          <div className="border border-border rounded-2xl p-4 bg-muted/30 h-80 relative">
            <div className={`absolute bottom-4 ${config.position === "bottom-right" ? "right-4" : "left-4"}`}>
              <div className="w-56 rounded-xl shadow-lg border border-border overflow-hidden bg-background">
                <div className="p-3 text-white text-xs font-medium" style={{ backgroundColor: config.primaryColor }}>
                  Chat with us
                </div>
                <div className="p-3 text-xs text-muted-foreground">{config.welcomeMessage}</div>
              </div>
              <div className={`mt-2 ${config.position === "bottom-right" ? "flex justify-end" : ""}`}>
                <div className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center" style={{ backgroundColor: config.primaryColor }}>
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
