// Meta Conversions API client — sends events to the backend which forwards to Meta server-side.
// Use this alongside the pixel helpers in meta-pixel.ts for redundant tracking (deduplication via event_id).

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.cirostack.com";

interface UserData {
  fbc?: string; // _fbc cookie value
  fbp?: string; // _fbp cookie value
  em?: string; // hashed email (SHA-256, lowercase, trimmed)
  ph?: string; // hashed phone
  fn?: string; // hashed first name
  ln?: string; // hashed last name
}

interface ConversionEvent {
  event_name: string;
  event_id?: string;
  event_source_url?: string;
  user_data?: UserData;
  custom_data?: Record<string, unknown>;
}

// ── Cookie helpers ──────────────────────────────────────────────────────────

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1];
}

function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// ── SHA-256 hashing (for PII normalization) ─────────────────────────────────

export async function hashSHA256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.trim().toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ── Main send function ──────────────────────────────────────────────────────

/**
 * Send an event to the Meta Conversions API via the backend.
 * Call this alongside the client-side pixel event for redundant tracking.
 * Meta deduplicates using event_id + event_name.
 */
export async function sendServerEvent(event: ConversionEvent): Promise<void> {
  try {
    const eventId = event.event_id || generateEventId();

    const payload = {
      events: [
        {
          event_name: event.event_name,
          event_id: eventId,
          event_time: Math.floor(Date.now() / 1000),
          event_source_url: event.event_source_url || window.location.href,
          action_source: "website" as const,
          user_data: {
            fbc: event.user_data?.fbc || getCookie("_fbc"),
            fbp: event.user_data?.fbp || getCookie("_fbp"),
            client_user_agent: navigator.userAgent,
            ...event.user_data,
          },
          custom_data: event.custom_data,
        },
      ],
    };

    // Fire and forget — don't block the UI
    fetch(`${API_BASE}/v1/meta/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true, // ensure the request completes even on page navigation
    }).catch((err) => {
      console.warn("[meta-capi] failed to send server event:", err);
    });
  } catch (err) {
    console.warn("[meta-capi] error preparing event:", err);
  }
}

// ── Convenience wrappers (mirror the pixel helpers) ─────────────────────────

export function sendServerPageView() {
  sendServerEvent({ event_name: "PageView" });
}

export function sendServerContact(params?: { content_name?: string }) {
  sendServerEvent({
    event_name: "Contact",
    custom_data: params,
  });
}

export async function sendServerLead(params?: {
  email?: string;
  content_name?: string;
  value?: number;
  currency?: string;
}) {
  const userData: UserData = {};
  if (params?.email) {
    userData.em = await hashSHA256(params.email);
  }
  sendServerEvent({
    event_name: "Lead",
    user_data: userData,
    custom_data: {
      content_name: params?.content_name,
      value: params?.value,
      currency: params?.currency,
    },
  });
}

export function sendServerSchedule(params?: { content_name?: string }) {
  sendServerEvent({
    event_name: "Schedule",
    custom_data: params,
  });
}

export function sendServerViewContent(params?: {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}) {
  sendServerEvent({
    event_name: "ViewContent",
    custom_data: params,
  });
}

export function sendServerPurchase(params: {
  value: number;
  currency: string;
  content_name?: string;
}) {
  sendServerEvent({
    event_name: "Purchase",
    custom_data: params,
  });
}
