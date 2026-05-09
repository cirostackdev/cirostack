# CiroStack Site Remedy Plan

Verified against source code. Each issue is marked **TRUE**, **FALSE**, or **PARTIAL** based on what was actually found in the files.

---

## Verdict Summary

| # | Issue | Verdict | File Evidence |
|---|---|---|---|
| 1 | Duplicate `\| CiroStack` in title tags | **TRUE** | see below |
| 2 | Gmail email sitewide | **TRUE** | Footer.tsx:342, Contact.tsx:46+62, Newsroom.tsx:190 |
| 3 | Social links point to `#` | **TRUE** | Footer.tsx (all 3 social anchors use `href="#"`) |
| 4 | `twitter:image` defaults to home.jpg | **PARTIAL** | layout.tsx:71 — pages that don't set their own twitter metadata inherit it |
| 5 | Generic keywords not per-page | **TRUE** | layout.tsx:34-43 — only set once globally, no page overrides |
| 6 | Testimonials duplicated in HTML | **TRUE** | TestimonialsMarquee.tsx:42-43 — items duplicated 2× or 4× for loop |
| 7 | Homepage headline too generic | **TRUE** | Index.tsx — "Software, engineered for your industry" |
| 8 | Stats block shows "20+ Industries" | **TRUE** | Index.tsx:260 |
| 9 | Ticker links to `/industries/` | **FALSE** | Index.tsx:145-176 — ticker already uses `/startups/` links |
| 10 | About counters render as "0+" | **TRUE** | About.tsx:165-173 — JS-only AnimatedCounter, no static fallback |
| 11 | Team count mismatch (5 vs 30+) | **TRUE** | About.tsx imports 5 team members; Careers.tsx:137 claims "30+" |
| 12 | "Junior AI Researcher" on Careers | **TRUE** | Careers.tsx:75 |
| 13 | All apply buttons → `/contact` | **TRUE** | Careers.tsx:189, 268 |
| 14 | Glassdoor/satisfaction claims unsourced | **TRUE** | Careers.tsx:139-140 — no links to source |
| 15 | Portfolio index broken/empty | **FALSE** | Portfolio.tsx renders a full filtered grid; page is hidden by `HIDE_CASE_STUDIES=true` |
| 16 | Blog categories not startup-aligned | **PARTIAL** | "Startup Playbook" exists; others (AI & ML, Cloud & DevOps, etc.) are tech-focused |
| 17 | All blog authors "CiroStack Team" | **TRUE** | Blog.tsx:71-85 — every post has `author: "CiroStack Team"` |
| 18 | Contact page no phone/booking link | **TRUE** | Contact.tsx — email only, no phone, no Calendly |
| 19 | Missing `og:image` on startup subpages | **TRUE** | e.g. healthtech/page.tsx — openGraph has no `images` key |
| 20 | Double CiroStack in startup page titles | **TRUE** | Page sets `"Healthtech Startups \| CiroStack"` + layout template appends `\| CiroStack` → `"... \| CiroStack \| CiroStack"` |

---

## Fix Instructions

### 🔴 Priority 1 — Credibility blockers

#### Issue 2 — Replace Gmail with custom domain email
Replace all instances of `cirostack@gmail.com` with `contact@cirostack.com` (or chosen address) in:
- `src/components/Footer.tsx:342,345`
- `src/pages-src/Contact.tsx:46,62`
- `src/pages-src/Newsroom.tsx:190`

---

#### Issue 3 — Fix broken social links
In `src/components/Footer.tsx`, replace the three `href="#"` anchors with real profile URLs:
```tsx
<a href="https://linkedin.com/company/cirostack" ...>
<a href="https://instagram.com/cirostack" ...>
<a href="https://facebook.com/cirostack" ...>
```

---

### 🔴 Priority 2 — SEO / title tag damage

#### Issue 20 — Double "CiroStack" in startup subpage titles
All startup subpages (60 files across `src/app/startups/**/page.tsx`) set their title as `"Page Name | CiroStack"`. The root layout template in `layout.tsx:31` then appends another `| CiroStack`.

**Fix:** Remove the manually appended `| CiroStack` from every startup page title. Change the pattern from:
```ts
title: startup ? `${startup.title} | CiroStack` : "Startups | CiroStack",
```
to:
```ts
title: startup ? startup.title : "Startups",
```
The layout template handles the suffix. Apply the same fix to any other affected pages (careers is fine — it already uses just `"Careers | CiroStack"` which the template would make `"Careers | CiroStack | CiroStack"` — confirm and fix).

---

#### Issue 5 — Per-page meta keywords
`layout.tsx:34-43` defines keywords globally. Each page that has unique content should override them via its own `metadata` export. Priority pages: all startup subpages, services pages, blog posts.

---

#### Issue 19 — Missing `og:image` on startup subpages
Every startup subpage `page.tsx` (healthtech, fintech, etc.) is missing `images` in its `openGraph` block. Add a fallback:
```ts
openGraph: {
  ...
  images: [{ url: `https://cirostack.com/og/startups/${slug}.jpg`, width: 1200, height: 630, alt: startup?.title }],
},
```
If per-page OG images don't exist yet, use a single shared startup OG image as a fallback: `https://cirostack.com/og/startups/default.jpg`.

---

#### Issue 4 — `twitter:image` falls back to home.jpg
Startup subpages and other pages without explicit `twitter` metadata inherit `layout.tsx:71` which uses `home.jpg` for every share.

**Fix:** Add `twitter` block to every startup subpage alongside the `openGraph` block:
```ts
twitter: {
  card: "summary_large_image",
  images: [`https://cirostack.com/og/startups/${slug}.jpg`],
},
```

---

### 🟠 Priority 3 — Homepage messaging

#### Issue 7 — Hero headline
`src/pages-src/Index.tsx` — "Software, engineered for your industry" is an industry-generalist framing inconsistent with the startup pivot. Suggested replacement: **"Software, engineered for your startup**.

#### Issue 8 — "20+ Industries" stat
`src/pages-src/Index.tsx:260` — Replace `{ value: "20+", label: "Industries" }` with a startup-relevant stat, e.g. `{ value: "10+", label: "Startup Verticals" }`.

---

### 🟠 Priority 4 — About & Careers credibility

#### Issue 10 — Animated counters show 0+ before JS loads
`src/pages-src/About.tsx:165-173` — `AnimatedCounter` has no static fallback. Add a `data-value` attribute or render the target value as the initial display, then animate from there client-side. Alternatively render the final value server-side and only animate if the component has mounted.

#### Issue 11 — Team count mismatch
About page imports 5 named team members. Careers page claims "30+ Team Members" at `Careers.tsx:137`. One must be corrected. 
- Update Careers stat to reflect actual headcount.

#### Issue 12 — "Junior AI Researcher" contradicts "senior-only" promise
`src/pages-src/Careers.tsx:75` — Remove or rename this role. If the position is legitimate, frame it as "AI Research Engineer" without the "Junior" qualifier. The "senior engineers on every project" promise is a core selling point.

#### Issue 13 — Apply buttons route to generic `/contact`
`src/pages-src/Careers.tsx:189,268` — Each job listing's Apply button links to `/contact`. Create a simple `/careers/apply?role=X` route.

#### Issue 14 — Glassdoor / satisfaction stats unsourced
`src/pages-src/Careers.tsx:139-140` 
- Remove both stats entirely.

---

### 🟡 Priority 5 — Blog & content

#### Issue 17 — All posts authored "CiroStack Team"
`src/pages-src/Blog.tsx:71-85` — Every blog post uses `author: "CiroStack Team"`. Add real author names and link to author bios. Update the data entries with individual names (e.g. Jessy Onah, James Okafor) and add author profile pages or at minimum a short bio section on the post page.

#### Issue 16 — Blog categories partially misaligned
Current categories: AI & Machine Learning, Custom Software, Cloud & DevOps, Product & UX, Industry Insights, Startup Playbook. add: "Founder Playbook", "MVP & Launch", "Funding & Tech", "African Startups" to match the startup positioning.

---

### 🟡 Priority 6 — Contact page

#### Issue 18 — No phone number or booking link
`src/pages-src/Contact.tsx` — Add at minimum a Calendly embed or link for direct booking. A phone number or WhatsApp number (already have WhatsApp popup) would also improve conversion for high-intent visitors.

---

### ✅ Already resolved / Non-issues

- **Issue 9** (ticker with `/industries/` links) — **Already fixed.** Ticker in `Index.tsx:145-176` uses `/startups/` paths.
- **Issue 15** (Portfolio broken) — Portfolio component renders a full grid correctly in code. Currently hidden site-wide by `NEXT_PUBLIC_HIDE_CASE_STUDIES=true` in `.env.local`.
- **Issue 6** (Testimonials duplication) — Intentional: `TestimonialsMarquee.tsx:42-43` duplicates items to create a seamless CSS loop. This is standard marquee technique, not a bug. The concern about contextual relevance (non-healthcare testimonials on healthcare pages) is valid — consider adding a `filter` prop to the component that accepts relevant testimonials per page.
