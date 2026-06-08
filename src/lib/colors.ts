/**
 * Standardized Color System for Admin & Client Portal
 *
 * 7 semantic colors — each used consistently:
 *   - Badge:       bg-{color}-500/15 text-{color}-500
 *   - Icon:        text-{color}-500
 *   - KPI value:   text-{color}-500
 *   - Alert:       bg-{color}-500/10 border-{color}-500/25
 *   - Interactive:  text-{color}-500 hover:bg-{color}-500/10
 *   - Dot/fill:    bg-{color}-500
 *   - Chart bar:   bg-{color}-500/80
 *
 * Colors:
 *   success  = green-500   → paid, active, completed, online, qualified
 *   info     = blue-500    → new, discovery, info, files
 *   warning  = amber-500   → unpaid, outstanding, contacted, proposal
 *   danger   = red-500     → overdue, lost, error, destructive
 *   accent   = purple-500  → review, consultation, in-progress
 *   neutral  = orange-500  → paused, events
 *   emphasis = emerald-500 → won, converted, special success
 */

// ─── Project Status ──────────────────────────────────────────────────────────

export const PROJECT_STATUS_COLORS: Record<string, string> = {
  discovery: "bg-blue-500/15 text-blue-500",
  proposal: "bg-amber-500/15 text-amber-500",
  active: "bg-green-500/15 text-green-500",
  review: "bg-purple-500/15 text-purple-500",
  complete: "bg-muted text-muted-foreground",
  paused: "bg-orange-500/15 text-orange-500",
};

// ─── Invoice Status ──────────────────────────────────────────────────────────

export const INVOICE_STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-500/15 text-green-500",
  unpaid: "bg-amber-500/15 text-amber-500",
  overdue: "bg-red-500/15 text-red-500",
  partial: "bg-amber-500/15 text-amber-500",
  cancelled: "bg-muted text-muted-foreground",
};

/** For shadcn Badge `variant` prop */
export const INVOICE_BADGE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "default",
  unpaid: "secondary",
  overdue: "destructive",
  partial: "outline",
  cancelled: "outline",
};

// ─── Lead Status ─────────────────────────────────────────────────────────────

export const LEAD_STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/15 text-blue-500",
  contacted: "bg-amber-500/15 text-amber-500",
  qualified: "bg-green-500/15 text-green-500",
  won: "bg-emerald-500/15 text-emerald-500",
  lost: "bg-red-500/15 text-red-500",
};

// ─── Conversation Status ─────────────────────────────────────────────────────

export const CONVERSATION_STATUS_COLORS: Record<string, string> = {
  open: "bg-green-500/15 text-green-500",
  closed: "bg-muted text-muted-foreground",
};

// ─── Submission Type ─────────────────────────────────────────────────────────

export const SUBMISSION_TYPE_COLORS: Record<string, string> = {
  start: "bg-blue-500/15 text-blue-500",
  consultation: "bg-purple-500/15 text-purple-500",
  careers: "bg-amber-500/15 text-amber-500",
  press: "bg-red-500/15 text-red-500",
  events: "bg-orange-500/15 text-orange-500",
  newsletter: "bg-green-500/15 text-green-500",
  resources: "bg-emerald-500/15 text-emerald-500",
};

// ─── KPI / Semantic icon + value colors ──────────────────────────────────────

export const SEMANTIC = {
  success: "text-green-500",
  info: "text-blue-500",
  warning: "text-amber-500",
  danger: "text-red-500",
  accent: "text-purple-500",
  neutral: "text-orange-500",
  emphasis: "text-emerald-500",
} as const;

// ─── Alert banners (dark-mode safe) ─────────────────────────────────────────

export const ALERT = {
  warning: "bg-amber-500/10 border-amber-500/25 text-amber-500",
  danger: "bg-red-500/10 border-red-500/25 text-red-500",
  success: "bg-green-500/10 border-green-500/25 text-green-500",
  info: "bg-blue-500/10 border-blue-500/25 text-blue-500",
} as const;

// ─── Interactive accents (buttons, hover states) ─────────────────────────────

export const INTERACTIVE = {
  success: "text-green-500 border-green-500/40 hover:bg-green-500/10",
  danger: "text-red-500 border-red-500/40 hover:bg-red-500/10",
  enable: "bg-green-500/15 text-green-500 hover:bg-green-500/20",
  disable: "bg-red-500/15 text-red-500 hover:bg-red-500/20",
} as const;

// ─── Presence / online indicators ────────────────────────────────────────────

export const PRESENCE = {
  online: "bg-green-500",
  offline: "bg-muted-foreground/40",
} as const;
