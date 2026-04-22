// Meta Pixel (Facebook Pixel) utilities
// Dataset ID: 1301589608584208

export const META_PIXEL_ID = "1301589608584208";

// ── Standard events ─────────────────────────────────────────────────────────

type StandardEvent =
  | "AddPaymentInfo"
  | "AddToCart"
  | "AddToWishlist"
  | "CompleteRegistration"
  | "Contact"
  | "CustomizeProduct"
  | "Donate"
  | "FindLocation"
  | "InitiateCheckout"
  | "Lead"
  | "PageView"
  | "Purchase"
  | "Schedule"
  | "Search"
  | "StartTrial"
  | "SubmitApplication"
  | "Subscribe"
  | "ViewContent";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function fbq(...args: unknown[]) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq(...args);
  }
}

/** Fire a standard Meta Pixel event */
export function trackEvent(event: StandardEvent, params?: Record<string, unknown>) {
  fbq("track", event, params);
}

/** Fire a custom Meta Pixel event */
export function trackCustomEvent(event: string, params?: Record<string, unknown>) {
  fbq("trackCustom", event, params);
}

// ── Convenience wrappers for common CiroStack events ────────────────────────

/** User viewed a page (auto-fired by the FacebookPixel component) */
export function trackPageView() {
  trackEvent("PageView");
}

/** User submitted a contact / inquiry form */
export function trackContact(params?: { content_name?: string }) {
  trackEvent("Contact", params);
}

/** User became a lead (e.g. newsletter signup, free consultation request) */
export function trackLead(params?: { content_name?: string; value?: number; currency?: string }) {
  trackEvent("Lead", params);
}

/** User scheduled a call / meeting */
export function trackSchedule(params?: { content_name?: string }) {
  trackEvent("Schedule", params);
}

/** User viewed a specific service or portfolio item */
export function trackViewContent(params?: {
  content_name?: string;
  content_category?: string;
  content_type?: string;
  value?: number;
  currency?: string;
}) {
  trackEvent("ViewContent", params);
}

/** User started the checkout / pricing flow */
export function trackInitiateCheckout(params?: {
  content_name?: string;
  value?: number;
  currency?: string;
  num_items?: number;
}) {
  trackEvent("InitiateCheckout", params);
}

/** User completed a purchase */
export function trackPurchase(params: { value: number; currency: string; content_name?: string }) {
  trackEvent("Purchase", params);
}
