/**
 * Feature flags driven by environment variables.
 *
 * Set in .env.local (or your hosting environment):
 *   NEXT_PUBLIC_HIDE_TESTIMONIALS=true   — hides all testimonial marquee sections
 *   NEXT_PUBLIC_HIDE_CASE_STUDIES=true   — hides all case study sections
 *   NEXT_PUBLIC_HIDE_ANNOUNCEMENTS=true  — hides company announcements in newsroom
 *   NEXT_PUBLIC_HIDE_TEAM=true           — hides the Team section on the About page
 */

export const HIDE_TESTIMONIALS =
  process.env.NEXT_PUBLIC_HIDE_TESTIMONIALS === "true";

export const HIDE_CASE_STUDIES =
  process.env.NEXT_PUBLIC_HIDE_CASE_STUDIES === "true";

export const HIDE_ANNOUNCEMENTS =
  process.env.NEXT_PUBLIC_HIDE_ANNOUNCEMENTS === "true";

export const HIDE_TEAM =
  process.env.NEXT_PUBLIC_HIDE_TEAM === "true";
