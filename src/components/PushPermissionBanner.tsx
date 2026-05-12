"use client";

import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, X } from "lucide-react";
import { useState } from "react";

export default function PushPermissionBanner({ ownerType }: { ownerType: "client" | "admin" }) {
  const { supported, permission, subscribed, subscribe, unsubscribe } = usePushNotifications(ownerType);
  const [dismissed, setDismissed] = useState(false);

  if (!supported || dismissed || permission === "denied" || subscribed) return null;
  if (permission === "granted") return null;

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
      <Bell className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium">Enable notifications</p>
        <p className="text-xs text-muted-foreground mt-0.5">Get notified about project updates, invoices, and messages.</p>
        <Button size="sm" className="mt-3" onClick={subscribe}>Enable notifications</Button>
      </div>
      <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
