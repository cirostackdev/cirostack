/**
 * Feature flags driven by environment variables.
 *
 * Set in .env.local (or your hosting environment):
 *   NEXT_PUBLIC_HIDE_TESTIMONIALS=true   — hides all testimonial marquee sections
 *   NEXT_PUBLIC_HIDE_CASE_STUDIES=true   — hides all case study sections
 */

export const HIDE_TESTIMONIALS =
  process.env.NEXT_PUBLIC_HIDE_TESTIMONIALS === "true";

export const HIDE_CASE_STUDIES =
  process.env.NEXT_PUBLIC_HIDE_CASE_STUDIES === "true";
