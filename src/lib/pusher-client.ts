"use client";

import PusherClient from "pusher-js";

let pusherInstance: PusherClient | null = null;

export function getPusher(): PusherClient {
  if (!pusherInstance) {
    pusherInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      channelAuthorization: {
        endpoint: "/api/pusher/auth",
        transport: "ajax",
      },
    });
  }
  return pusherInstance;
}

/** Set the visitor ID header for channel authorization */
export function setVisitorAuth(visitorId: string) {
  const pusher = getPusher();
  (pusher as any).config.channelAuthorization.headers = {
    "x-visitor-id": visitorId,
  };
}
