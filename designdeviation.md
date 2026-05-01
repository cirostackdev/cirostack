# Design Deviation Report — CiroStack Website

**Generated**: 2026-04-24  
**Reviewer**: Claude Code (automated audit)  
**Project root**: `C:/Users/USER/Desktop/friendly-greetings`

---

## Ground Design — Summary

The canonical design system is documented in **`design.md`** and **`brand.md`**, enforced through:

| File | Role |
|------|------|
| `src/styles/globals.css` | Canonical CSS variable tokens (HSL), shadcn/ui system |
| `src/app/globals.css` | Secondary CSS file — `@theme` block + animation keyframes |
| `tailwind.config.ts` | Font families, extended color tokens, border-radius, animations |
| `src/components/SectionHeading.tsx` | Canonical badge/heading pattern |
| `src/components/PageHero.tsx` | Canonical page hero pattern |

**Key design ground rules** extracted from the documentation:

- **Fonts**: `Bricolage Grotesque` (display) + `Sora` (body), loaded via `next/font/google`. Tailwind classes: `font-display` / `font-body`.
- **Heading weight**: `font-weight: 600` (`font-semibold`) for all headings per `app/globals.css` line 27.
- **Brand red**: `#E53935` → `hsl(1 77% 55%)` → `--primary`. Fully consolidated in `styles/globals.css`.
- **Gradient**: `linear-gradient(135deg, hsl(var(--gradient-start)) 0%, hsl(var(--gradient-end)) 100%)` — red-to-purple, applied via `.text-gradient` utility only.
- **Section padding**: `py-20 md:py-28 lg:py-32` via `.section-padding` utility.
- **Border radius**: `--radius: 0.75rem` → `rounded-lg`. Cards use `rounded-2xl` or `rounded-xl`.
- **Cards**: `.surface-glass` = `bg-card border border-border/50` (no backdrop-blur in current implementation — design.md recommends solid `bg-card` for content cards).
- **Buttons — CTA**: `rounded-full` for primary CTAs. `rounded-lg` (or default `rounded-md`) for utility/secondary buttons.
- **Section badge pattern** (per `design.md` section on Section Badges): `px-3 py-1 mb-4 text-xs font-medium tracking-wider uppercase rounded-full bg-primary/10 text-primary border border-primary/20`.
- **Color**: All colors via design token (`text-primary`, `text-foreground`, `text-muted-foreground`, `bg-background`, etc.). No raw Tailwind palette colors (e.g., `green-600`, `slate-950`) in UI components.
- **Images**: Heroes should use `next/image` with `fill` and `sizes`, not `<img>` tags.
- **Accessibility**: All icon-only buttons must have `aria-label`. Skip-to-content link present.
- **Animation**: Framer Motion `whileInView` for viewport-triggered animations; `marquee` for testimonials.

---

## Section 1 — Color System Deviations

### 1.1 Hardcoded `emerald` / `green` instead of `--trust` or `--success` token

**Ground design**: The semantic token `--trust` (`hsl(152 60% 40%)` ≈ `#29A36B`) and `--color-success: #10B981` exist specifically for positive/verification states. Lucide checkmarks and confirmation icons should use `text-[hsl(var(--trust))]` or the mapped `text-trust` class.

**Deviations found**:

| File | Line | Deviation |
|------|------|-----------|
| `src/pages-src/About.tsx` | 285, 333 | `text-emerald-600` on `<CheckCircle>` icons |
| `src/pages-src/Careers.tsx` | 254 | `text-emerald-600` on `<CheckCircle>` icons |
| `src/pages-src/Pricing.tsx` | 52 | `text-emerald-600` on `<CheckCircle>` in `PackageCard` |
| `src/components/services/OurService.tsx` | 62 | `text-emerald-600` on `<CheckCircle>` |
| `src/pages-src/Sustainability.tsx` | 125, 155–156, 166, 174, 206, 237 | Multiple `text-emerald-600` and `bg-emerald-500/10` / `bg-emerald-500` usages |
| `src/pages-src/Newsletter.tsx` | 89 | `text-emerald-600` on `<CheckCircle>` |

**Impact**: Introduces a hardcoded green color (`#059669`) that is slightly different from both `--trust` (`#29A36B`) and `--color-success` (`#10B981`), and does not respond to dark mode via CSS variables.

---

### 1.2 Hardcoded Tailwind palette colors in Newsroom tag badges

**Ground design**: Semantic tags should use design token classes. No raw `blue-*`, `green-*`, `yellow-*`, `purple-*` Tailwind colors.

**File**: `src/pages-src/Newsroom.tsx`, lines 74–78

```typescript
// ACTUAL (deviation):
const tagColors = {
    Funding:     "bg-green-100 text-green-800",
    Recognition: "bg-yellow-100 text-yellow-800",
    Media:       "bg-blue-100 text-blue-800",
    Partnership: "bg-purple-100 text-purple-800",
    Product:     "bg-red-100 text-red-800",
};
```

These six raw palette colors are not part of the token system, do not adapt to dark mode, and visually conflict with the warm cream surface palette.

---

### 1.3 `BookConsultation` uses hardcoded `slate-*` colors — breaks dark mode integration

**Ground design**: All background and text colors must come from CSS variable tokens.

**File**: `src/components/services/BookConsultation.tsx`, lines 10–13, 24

```tsx
// ACTUAL (deviation):
<section className="py-24 md:py-32 bg-slate-950 text-white dark:bg-slate-900 border-y border-slate-800 ...">
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 ..." />
    <p className="text-xl text-slate-400 ...">
```

**Expected**: Should use `bg-foreground text-background` (inverted section) or a custom dark section utility consistent with the design token system. The `bg-blue-500/10` orb decoration uses a raw blue not present in the design system.

---

### 1.4 `About.tsx` uses `bg-slate-50 dark:bg-slate-900/50` for a section background

**Ground design**: Section backgrounds must use tokens — either `bg-background`, `bg-card`, `bg-muted`, `section-alt`, or `bg-secondary/X`.

**File**: `src/pages-src/About.tsx`, line 295

```tsx
// ACTUAL (deviation):
<section className="py-24 bg-slate-50 dark:bg-slate-900/50 border-y border-border/50">
```

**Expected**: `bg-muted` or `section-alt` or `bg-secondary/30` to stay within the warm token system.

---

### 1.5 Sustainability SDG block uses unmapped hardcoded background colors

**File**: `src/pages-src/Sustainability.tsx`, lines 57–61

```typescript
// ACTUAL (deviation):
{ color: "bg-yellow-500" },
{ color: "bg-orange-500" },
{ color: "bg-amber-700" },
{ color: "bg-green-700" },
{ color: "bg-blue-800" },
```

The SDG color coding is intentional (they are UN standard colors), but they are raw Tailwind palette values with no design-token bridge. At minimum, the deviating warm colors (`bg-yellow-500`, `bg-amber-700`) conflict visually with the site's warm cream palette.

---

### 1.6 `TestimonialsMarquee` uses hardcoded `amber-500` for star ratings

**File**: `src/components/TestimonialsMarquee.tsx`, line 84

```tsx
// ACTUAL (deviation):
<Star key={s} className="w-4 h-4 md:w-5 md:h-5 text-amber-500 fill-amber-500" />
```

No `--warning` token (which is `#F59E0B`, equivalent to `amber-500`) class exists in Tailwind config for direct use. This is borderline acceptable since the visual result is correct, but it should be `text-[--color-warning]` or a mapped `text-warning` class if one were added.

---

## Section 2 — Typography Deviations

### 2.1 `SectionHeading.tsx` uses `font-bold` but design spec mandates `font-semibold` for headings

**Ground design**: `app/globals.css` line 27 defines heading weight as `font-weight: 600` (`font-semibold`). The `design.md` section on typography also states `font-weight: 600`.

**File**: `src/components/SectionHeading.tsx`, line 25

```tsx
// ACTUAL (deviation):
<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">
```

**Expected**: `font-semibold` to match the global heading rule.

---

### 2.2 Pervasive use of `font-bold` on `h3` and `h4` across service and page components

The canonical heading weight from `app/globals.css` is `font-weight: 600` (`font-semibold`). The following components define `h3`/`h4` elements with `font-bold` (`font-weight: 700`):

| File | Lines | Element |
|------|-------|---------|
| `src/components/services/OurService.tsx` | 20, 31, 47 | `h3`, `h4` — `font-bold` (missing `font-display` on line 31) |
| `src/components/services/ReasonsToChoose.tsx` | 123 | `h3` — `font-bold` only, no `font-display` |
| `src/components/services/ServiceProcess.tsx` | 12, 39 | `h3`, `h4` — `font-bold` |
| `src/components/services/ValueProps.tsx` | 12, 30 | `h3`, `h4` — `font-bold` |
| `src/pages-src/ServiceDetail.tsx` | 159, 207 | `h3` — `font-bold` only, no `font-display` |
| `src/pages-src/About.tsx` | 329 | `h3` — `font-bold`, no `font-display` |

The inconsistency is particularly notable in `ReasonsToChoose.tsx` line 123 and `ServiceDetail.tsx` lines 159, 207, where `font-display` is also missing from the heading, meaning it renders in Sora (body font) instead of Bricolage Grotesque.

---

### 2.3 `ServiceIntro` applies `text-primary` to a full-width large heading — violates gradient usage rule

**Ground design**: `design.md` section on "The Gradient" and color: "Do NOT use [brand red] on: body text, large background fills, or anywhere it competes with readability." The primary red on a large heading at `text-4xl` to `text-6xl` in a centered block is exactly the use case warned against.

**File**: `src/components/services/ServiceIntro.tsx`, line 19

```tsx
// ACTUAL (deviation):
<h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight text-primary">
    {title} that delivers <span className="text-muted-foreground font-medium italic">{summary}</span>
</h2>
```

The full heading is in `text-primary` (brand red). At `text-6xl` this creates a very heavy red block. The design intends red to be used as an accent, not as full-heading color for large text. The `text-gradient` class on a `<span>` would be the correct approach for a hero-style accent.

---

### 2.4 `OurService.tsx` line 31 — `h4` heading missing `font-display`

**File**: `src/components/services/OurService.tsx`, line 31

```tsx
// ACTUAL (deviation):
<h4 className="text-xl font-bold mb-6 border-b border-border pb-4">Key Capabilities</h4>
```

Missing both `font-display` and the correct weight. Renders in Sora (body font) — breaks the display/body font split.

---

## Section 3 — Section Badge Deviations

### 3.1 `SectionHeading` badge uses `bg-muted text-muted-foreground` — conflicts with design spec

**Ground design** (`design.md`, Section on Section Badges):
```html
<span class="... bg-primary/10 text-primary border border-primary/20">
```

**Actual** (`src/components/SectionHeading.tsx`, line 21):
```tsx
<span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider uppercase rounded-full bg-muted text-muted-foreground border border-border">
```

The documented pattern uses `bg-primary/10` (light red tint) with `text-primary` (red text) and `border-primary/20`. The implementation uses neutral muted tokens instead, making badges look generic gray rather than brand-colored.

---

### 3.2 Badge padding and size inconsistencies across components

The documented badge spec uses `px-3 py-1 text-xs`. Industry components use a different size:

| Component | Badge classes | Deviation |
|-----------|--------------|-----------|
| `SectionHeading.tsx` line 21 | `px-3 py-1 text-xs font-medium tracking-wider` | Canonical |
| `src/components/industries/IndustryChallenges.tsx` line 30 | `px-4 py-1.5 text-sm font-semibold tracking-widest` | Larger padding, larger text, heavier weight |
| `src/components/industries/IndustryValueProps.tsx` line 21 | `px-4 py-1.5 text-sm font-semibold tracking-widest` | Same larger variant |
| `src/components/industries/RelatedCaseStudies.tsx` line 32 | `px-4 py-1.5 text-sm font-semibold tracking-widest` | Same larger variant |
| `src/pages-src/Index.tsx` line 152 | `px-4 py-1.5 text-xs font-semibold tracking-widest` | Mixed size |
| `src/pages-src/PageHero.tsx` line 56 | `px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em]` | Hero-specific — acceptable on hero, but uses non-standard `text-[11px]` |

Three different badge sizes (`px-3 py-1 text-xs`, `px-4 py-1.5 text-sm`, `px-4 py-1.5 text-xs`) are in use across the site when a single canonical pattern should be applied.

---

## Section 4 — Button Radius Deviations

### 4.1 Mixed `rounded-full` and `rounded-md` (default) CTA buttons — explicit design debt

**Ground design** (`design.md` section on Buttons): "Use `rounded-full` for all primary CTAs and `rounded-lg` for secondary/utility buttons."

The following CTA buttons use the default `rounded-md` instead of `rounded-full`:

| File | Line | Button | Deviation |
|------|------|--------|-----------|
| `src/pages-src/About.tsx` | 260 | "Start a Conversation" — `<Button>` (default = `rounded-md`) | Missing `rounded-full` |
| `src/pages-src/About.tsx` | 513 | "Get a Free Quote" — `<Button size="lg">` | Missing `rounded-full` |
| `src/pages-src/About.tsx` | 517 | "View Our Work" — `<Button size="lg" variant="outline">` | Missing `rounded-full` |
| `src/components/services/BookConsultation.tsx` | 28 | Primary CTA — has `rounded-full` | Compliant |
| `src/pages-src/Careers.tsx` | 270 | "Send Open Application" — `<Button size="lg">` | Missing `rounded-full` |
| `src/pages-src/Contact.tsx` | 142 | "Send Message" — `<Button type="submit" size="lg" className="w-full">` | Missing `rounded-full` |
| `src/pages-src/ServiceDetail.tsx` | 86 | "Return to Services" fallback `<Button>` | Utility button — `rounded-lg` is acceptable here |
| `src/pages-src/Services.tsx` (inferred) | — | Inline service CTA buttons | Need audit |

Hero and Index CTAs (`HeroSlider`, `Index.tsx`, `PageHero.tsx`) correctly use `rounded-full`.

---

## Section 5 — Section Padding Deviations

### 5.1 Manual `py-24` used instead of `.section-padding` utility

**Ground design**: Section vertical rhythm is enforced via `.section-padding` = `py-20 md:py-28 lg:py-32`. Manual `py-24` bypasses responsive scaling.

Sections using raw `py-24` instead of `section-padding`:

| File | Lines | Value |
|------|-------|-------|
| `src/pages-src/About.tsx` | 228, 295, 346, 384, 430, 503 | `py-24` (fixed, not responsive) |
| `src/components/services/ServiceProcess.tsx` | 8 | `py-24` |
| `src/components/services/OurService.tsx` | 9 | `py-24` |
| `src/components/services/WhoWeHelped.tsx` | 9 | `py-24` |
| `src/components/services/ValueProps.tsx` | 8 | `py-24` |
| `src/pages-src/ServiceDetail.tsx` | 137, 192, 226 | `py-24` |
| `src/components/services/BookConsultation.tsx` | 10 | `py-24 md:py-32` (partially responsive, but different breakpoint) |
| `src/components/services/ServiceIntro.tsx` | 7 | `py-20 md:py-32` (jumps from 20 to 32, skipping the 28 mid-step) |
| `src/components/TestimonialsMarquee.tsx` | 52 | `py-14 md:py-24` (different scale entirely) |

`TestimonialsMarquee` deviates most significantly — `py-14` on mobile is notably smaller than the `py-20` canonical minimum, creating a squashed section compared to all other sections.

---

## Section 6 — Hero & Image Implementation Deviations

DO NOT IMPLEMENT ANY OF THIS SECTION 6 RECOMMENDATION

### 6.1 All hero images use `<img>` tags — not `next/image`

**Ground design** (`design.md` section on Hero Pattern, issue #6): "Use `next/image` with `fill` and `sizes` prop, or at minimum add `srcSet` with responsive breakpoints." Currently a documented `NOT DONE` item.

**Files using plain `<img>` for hero backgrounds**:
- `src/components/HeroSlider.tsx` line 25 — `<img src={heroBg} ...>`
- `src/components/PageHero.tsx` line 42 — `<img src={image} ...>`

**Files using plain `<img>` for content images**:
- `src/pages-src/About.tsx` lines 319, 453, 463 — team cards and alternating-row images
- `src/pages-src/Index.tsx` line 352 — portfolio project images
- `src/components/services/ReasonsToChoose.tsx` line 113 — reason images
- `src/pages-src/ServiceDetail.tsx` line 152 — case study images

No `next/image` component is used anywhere in the codebase. `import Image from "next/image"` returns zero results.

---

### 6.2 Index page hero (`Index.tsx`) uses a different layout than `HeroSlider`/`PageHero`

**Ground design**: The hero pattern is defined as "Full-viewport-height hero with background image, dark overlay, and centered/left-aligned white text" using `PageHero` or `HeroSlider`.

**File**: `src/pages-src/Index.tsx`, line 147

The homepage hero does not use `HeroSlider` or `PageHero`. Instead it uses:
```tsx
<section className="relative min-h-[100dvh] flex items-center justify-center pt-20 md:pt-24 pb-16">
```

This section has **no background image** — it renders on the plain `bg-background` (warm cream). Other pages all have a dramatic full-viewport photo hero. The homepage is visually inconsistent with the established hero pattern used on every other primary page.

---

## Section 7 — About Page Section Heading Inconsistency

### 7.1 About page does not use `SectionHeading` component for section headers

**Ground design**: The `SectionHeading` component is the canonical pattern for section headers (badge + h2 + description). All other pages (Careers, OurCulture, Pricing, Newsroom, etc.) use it.

**File**: `src/pages-src/About.tsx` — uses inline ad-hoc header patterns throughout:

```tsx
// Lines 235, 349, 388, 433 — ACTUAL (deviation):
<h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">The Story</h2>
<h3 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
    Why I started CiroStack
</h3>
```

The eyebrow `h2` (semantically wrong — should not be `h2` for a small label above the main `h3`) uses `text-muted-foreground` in a small bold uppercase style. This differs from both the `SectionHeading` badge (which is a `<span>`) and from the page hero badge pattern. It creates four different label styles in one page.

---

## Section 8 — Legacy Package Debt (confirmed present)

**Ground design** (`design.md` issue #2): "@fontsource packages remain in package.json and may still be imported in styles/globals.css."

**`package.json`** confirms these legacy dependencies are still installed:

```
@fontsource/inter         : ^5.2.8
@fontsource/space-grotesk : ^5.2.10
```

Neither is imported in any `.tsx` or `.css` file in `src/` (confirmed by grep), so they are dead dependencies that add unnecessary `node_modules` weight without any code reference. They should be removed.

Additionally, both animation libraries are simultaneously installed:

```
framer-motion : ^12.34.3
gsap          : ^3.14.2
@gsap/react   : ^2.1.2
```

`design.md` flags "dual animation libraries add unnecessary weight." No GSAP usage was found in the surveyed component files — all animation uses Framer Motion. GSAP appears unused in the current build.

Three.js is also present but unused as components:

```
three                  : ^0.183.2
@react-three/fiber     : ^8.18.0
@react-three/drei      : ^9.122.0
@types/three           : ^0.183.1
```

`HeroGlobe.tsx` and `ParticleNetwork.tsx` exist but are not imported by any page (confirmed — their file headers contain usage instructions as comments, not active imports).

---

## Section 9 — Inconsistent Contact Email Address

ALL EMAIL SHOULD BE: contact@cirostack.com

**Ground design** (`brand.md`): Contact email listed as `contact@cirostack.com`.

**Deviation**: The majority of the codebase uses `hello@cirostack.com`, with one instance using `contact@cirostack.com`:

| File | Line | Email |
|------|------|-------|
| `src/components/Footer.tsx` | 151, 154 | `hello@cirostack.com` |
| `src/pages-src/Contact.tsx` | 46, 62 | `hello@cirostack.com` |
| `src/pages-src/Index.tsx` | 496–497 | `contact@cirostack.com` ← **different** |
| `src/pages-src/Pricing.tsx` | 428 | `hello@cirostack.com` |
| `src/pages-src/Privacy.tsx` | 35 | `hello@cirostack.com` |
| `src/pages-src/Terms.tsx` | 35 | `hello@cirostack.com` |

`Index.tsx` is the only file using `contact@cirostack.com`. All other references use `hello@cirostack.com`. One of these is wrong — visitors following the homepage CTA email link will reach a different address than the contact page.

---

## Section 10 — Surface-Glass on Content Cards

DO NOT IMPLEMENT THIS SECTION 10 RECOMMENDATION

### 10.1 `surface-glass` used on content-heavy cards — against design recommendation

**Ground design** (`design.md` section on Cards): "Use `bg-card` (solid) for content-heavy cards and reserve `surface-glass` for decorative/hero elements."

`surface-glass` is used 50 times across the codebase, many on content cards:

| File | Usage |
|------|-------|
| `src/pages-src/Index.tsx` lines 245, 349 | Industry grid cards, portfolio project cards |
| `src/pages-src/Pricing.tsx` lines 36, 317, 389, 409 | Package cards, "What's Included" items, FAQ accordion, payment steps |
| `src/pages-src/Newsroom.tsx` lines 128, 151 | News article cards |
| `src/pages-src/Careers.tsx` lines 174, 216 | Job role cards, perks cards |
| `src/pages-src/OurCulture.tsx` lines 106, 136 | Values cards, perks cards |
| `src/pages-src/About.tsx` line 272 | "How we work" checklist card |
| `src/components/services/BookConsultation.tsx` | Not used (this CTA section deviates in different way) |

The current `surface-glass` definition in `styles/globals.css` (line 173) is `bg-card border border-border/50` — no `backdrop-blur` — so the GPU concern from the design doc no longer applies. However, these are all using a semi-transparent card definition (no `bg-card/60` as originally noted, but the pattern is used broadly and inconsistently against the "decorative only" guidance).

---

## Section 11 — `bg-primary/8` Non-Standard Opacity


DO NOT CHANGE ANYTHING IN THE HOME PAGE, AND NEW PAGES WITH DESIGNS SIMILAR TO THE HOME PAGE EXCEPT IF I EXPLICTLY ASK YOU TO

**File**: `src/pages-src/Index.tsx`, line 152

```tsx
// ACTUAL (deviation):
<span className="... bg-primary/8 text-primary border border-primary/15">
```

Tailwind v3 opacity modifiers use integers that resolve to multiples of 5 (or explicit fractions). `bg-primary/8` and `border-primary/15` are non-standard values — Tailwind will generate custom opacity CSS for these, but they are not part of the design system's established opacity scale (`/10`, `/20`, `/30`, `/50`, `/60`). Should be `bg-primary/10` and `border-primary/20` to match the badge spec.

---

## Section 12 — Accessibility Issues Not Yet Resolved

Per `design.md` section 4, "NOT DONE" items:

### 12.1 Skip-to-content anchor mismatch

**File**: `src/app/layout.tsx` line 110

```tsx
// layout.tsx skip link:
<a href="#main-content" ...>Skip to content</a>
// layout.tsx main element:
<main id="main-content" ...>
```

This is correctly implemented. The design.md noted a previous version used `href="#main"` — that was fixed. No deviation here. ✓

### 12.2 Missing `aria-label` on icon-only interactive elements

The navbar search button and menu toggle have `aria-label` (lines 761, 777 of `Navbar.tsx`). The `ThemeToggle` has `aria-label="Toggle theme"` (lines 23, 39 of `ThemeToggle.tsx`).

However, `WhatsAppPopup.tsx` close button — not audited in the full component but the overall pattern uses only an `X` icon with no surrounding label text. Needs confirmation.

---

## Section 13 — Animation Overuse

THIS DOES NOT APPLY TO THE HOMEPAGE

**Ground design** (`design.md` section on Animations): "Keep animations on the first 2-3 viewport sections; below the fold, use CSS `animation: fadeIn` with `IntersectionObserver` instead of Framer Motion. Remove animation entirely from dense content sections."

**Confirmed count**: 76 `whileInView` instances across the codebase (grep result). The design document flagged 78 — essentially unchanged since the audit was written.

Notable dense sections still using `whileInView` on every card:
- `About.tsx` — stats bar (6 cards), team grid (5 cards), values grid (4 cards), tech stack (4 cards), all individually animated
- `Careers.tsx` — every job role card, every perk card, every process step
- `OurCulture.tsx` — every value card, every perk card
- `Newsroom.tsx` — every news item

---

## Section 14 — Homepage Hero Does Not Use HeroSlider
DO NOT CHANGE THE HOME PAGE. DELETE heroslider, not used, not needed.

This is a structural deviation noted in Section 6.2 but worth explicit isolation:

**File**: `src/pages-src/Index.tsx` vs. `src/components/HeroSlider.tsx`

`HeroSlider.tsx` exists as the purpose-built homepage hero component (full-viewport, dark-overlay image, left-aligned text, eyebrow line, stat pill). The `Index.tsx` page does **not** render `HeroSlider` — it renders its own inline section with no hero image. This means the homepage hero component exists but is unused, and the homepage has a visually inconsistent hero (no background image, no dramatic full-bleed photo).

---

## Summary Table

| # | File(s) | Issue | Severity |
|---|---------|-------|---------|
| 1 | `About.tsx:285,333`, `Careers.tsx:254`, `Pricing.tsx:52`, `OurService.tsx:62`, `Sustainability.tsx:125+`, `Newsletter.tsx:89` | `text-emerald-600` instead of `--trust`/`--success` tokens | Medium |
| 2 | `Newsroom.tsx:74–78` | Raw `bg-green-100`, `bg-yellow-100`, `bg-blue-100`, `bg-purple-100` tag colors | Medium |
| 3 | `BookConsultation.tsx:10,13,24` | `bg-slate-950`, `bg-slate-900`, `text-slate-400`, `bg-blue-500/10` — not design tokens | High |
| 4 | `About.tsx:295` | `bg-slate-50 dark:bg-slate-900/50` instead of token-based surface | Medium |
| 5 | `Sustainability.tsx:57–61` | SDG block `bg-yellow-500`, `bg-orange-500`, `bg-amber-700`, `bg-green-700`, `bg-blue-800` | Low |
| 6 | `TestimonialsMarquee.tsx:84`, `OurCulture.tsx:159`, `WhoWeHelped.tsx:19` | `text-amber-500` / `text-yellow-500` for star ratings | Low |
| 7 | `SectionHeading.tsx:25` | `font-bold` instead of `font-semibold` on main h2 | Medium |
| 8 | `OurService.tsx:20,31,47`, `ReasonsToChoose.tsx:123`, `ServiceProcess.tsx:12,39`, `ValueProps.tsx:12,30`, `ServiceDetail.tsx:159,207`, `About.tsx:329` | `font-bold` instead of `font-semibold`; some also missing `font-display` | Medium |
| 9 | `ServiceIntro.tsx:19` | Full large heading in `text-primary` (brand red) — design says not on large text | Medium |
| 10 | `OurService.tsx:31` | `h4` missing `font-display` class — renders in body font | Medium |
| 11 | `SectionHeading.tsx:21` | Badge uses `bg-muted text-muted-foreground` instead of `bg-primary/10 text-primary border-primary/20` | Medium |
| 12 | `IndustryChallenges.tsx:30`, `IndustryValueProps.tsx:21`, `RelatedCaseStudies.tsx:32` | Badge `px-4 py-1.5 text-sm` instead of canonical `px-3 py-1 text-xs` | Low |
| 13 | `Index.tsx:152` | Badge uses non-standard `bg-primary/8` and `border-primary/15` | Low |
| 14 | `About.tsx:260,513,517`, `Careers.tsx:270`, `Contact.tsx:142` | Primary CTAs missing `rounded-full` — default `rounded-md` | Medium |
| 15 | `About.tsx:228+` (6 sections), `ServiceProcess.tsx:8`, `OurService.tsx:9`, `WhoWeHelped.tsx:9`, `ValueProps.tsx:8`, `ServiceDetail.tsx`, `ServiceIntro.tsx`, `TestimonialsMarquee.tsx` | `py-24` (fixed) or non-standard padding instead of `.section-padding` | Medium |
| 16 | `HeroSlider.tsx:25`, `PageHero.tsx:42`, `About.tsx`, `Index.tsx`, `ServiceDetail.tsx`, etc. | `<img>` tags instead of `next/image` for all images | High |
| 17 | `Index.tsx:147` | Homepage renders its own hero section — `HeroSlider` component unused | High |
| 18 | `package.json` | `@fontsource/inter`, `@fontsource/space-grotesk`, `gsap`, `@gsap/react`, `three`, `@react-three/fiber`, `@react-three/drei` — all unused | Medium |
| 19 | `Index.tsx:496–497` | `contact@cirostack.com` email — conflicts with `hello@cirostack.com` used everywhere else | High |
| 20 | 50 instances | `surface-glass` used on content-heavy cards against design recommendation | Low |
| 21 | `About.tsx:235,349,388,433` | Ad-hoc inline header patterns instead of `SectionHeading` component | Medium |
| 22 | Codebase-wide | 76 `whileInView` Framer Motion instances — design calls for limiting to top 3 sections | Low |
