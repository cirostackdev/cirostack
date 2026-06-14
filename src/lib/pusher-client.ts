"use client";

import PusherClient from "pusher-js";

let pusherInstance: PusherClient | null = null;

export function getPusher(): PusherClient | null {
  if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
    return null;
  }
  if (!pusherInstance) {
    pusherInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      channelAuthorization: {
        // Custom handler so we can send x-visitor-id at auth time (not init time)
        customHandler: async (
          { socketId, channelName }: { socketId: string; channelName: string },
          callback: (error: Error | null, data: any) => void
        ) => {
          const visitorToken =
            typeof window !== "undefined"
              ? (localStorage.getItem("ciro_visitor_token") ?? "")
              : "";
          try {
            const res = await fetch("/api/pusher/auth", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                ...(visitorToken ? { "x-visitor-token": visitorToken } : {}),
              },
              body: new URLSearchParams({
                socket_id: socketId,
                channel_name: channelName,
              }).toString(),
            });
            if (res.ok) {
              callback(null, await res.json());
            } else {
              callback(new Error(`Pusher auth failed: ${res.status}`), null);
            }
          } catch (err) {
            callback(err instanceof Error ? err : new Error(String(err)), null);
          }
        },
      },
    });
  }
  return pusherInstance;
}
