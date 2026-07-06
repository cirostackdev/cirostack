# CiroStack Design System Audit & Recommendations

> **Last updated**: 2026-04-22
> **Previous revision**: 2026-04-20 (initial audit)

## 1. Current Design System Inventory

### Typography

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Display (headings) | Bricolage Grotesque | 400, 500, 600, 700 | h1-h6, brand name, section titles |
| Body | Sora | 400, 500, 600 | Paragraphs, UI text, navigation |

*(Updated 2026-04-22: Migrated from Space Grotesk + Inter to Bricolage Grotesque + Sora for a warmer, more distinctive brand feel.)*

**Loading**: `next/font/google` (layout.tsx) with CSS variables `--font-bricolage-grotesque` and `--font-sora`, display mode `swap`.

**Issue: Double font loading still present.** Legacy `@fontsource/inter` and `@fontsource/space-grotesk` packages remain in package.json and may still be imported in styles/globals.css. These are no longer the active fonts and should be removed to eliminate unnecessary downloads.

**Tailwind font config**:
```typescript
fontFamily: {
  display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
  body: ['Sora', 'system-ui', 'sans-serif'],
}
```

**Heading styles**: `font-weight: 600`, `letter-spacing: -0.02em` (set in app/globals.css). This tight tracking works well for large display sizes but becomes slightly cramped at `text-sm`/`text-base` on labels and badges.

**Recommendation**: Remove `@fontsource` packages from package.json and all related CSS imports. Loosen letter-spacing on headings smaller than `text-xl` to `-0.01em` or `0`.

---

### Color System

The site has **two parallel color systems** that partially conflict:

#### System 1: HSL CSS Variables (styles/globals.css — shadcn/ui tokens)
```
--primary:            1 77% 55%    → #E53935 (toned-down brand red)
--accent:             263 84% 58%  → #7C3AED (AI purple)
--background:         33 100% 98%  → #FFFAF5 (warm cream)
--foreground:         20 14% 15%   → #2A2420 (warm charcoal)
--secondary:          33 50% 91%   → warm beige
--muted:              33 40% 93%   → light warm gray
--muted-foreground:   20 10% 40%   → #706358
--border:             33 30% 88%   → warm border
--trust:              152 60% 40%  → #29A36B (green)
--success:            10 100% 60%  → #10B981
--warning:            45 96% 56%   → #F59E0B
--destructive:        0 84% 60%    → #EF4444
```

*(Updated 2026-04-22: Primary red changed from `#E82121`/`#D63A3A` to `#E53935` — a more balanced, professional tone. AI purple integrated as `--accent`.)*

#### System 2: Direct hex values (app/globals.css — legacy @theme block)
```
--color-brand:        #E82121      (legacy brighter red — conflicts with System 1)
--color-brand-dark:   #C41B1B
--color-brand-light:  #F04040
--color-ai:           #7C3AED      (purple — duplicates --accent)
--color-bg:           #FFFAF5      (slightly different cream)
--color-text:         #2A2420
--color-border:       #EDE5D8
```

**Issue (partially addressed): The two reds still conflict.** `--primary` now resolves to `#E53935` while legacy `--color-brand` is still `#E82121`. Components using `text-primary` get one red; components using `text-brand` get another. The gap is smaller than before but still creates inconsistency.

**Issue: Two separate dark mode definitions.** styles/globals.css defines `.dark` with one set of values; app/globals.css defines `.dark` with different values. The cascade means whichever loads last wins — fragile and confusing.

**Recommendation:**
- **Consolidate to a single file.** Move everything into styles/globals.css (the shadcn/ui canonical location)
- **Standardize on `#E53935`** as the single brand red across both systems
- **Remove app/globals.css entirely** or reduce it to just the `@import "tailwindcss"` directive, with all custom properties in styles/globals.css
- **Remove legacy `--color-brand` variables** and update any components still referencing them to use `--primary`

### Proposed Consolidated Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--primary` | `#E53935` (CiroStack red) | `#E53935` | CTAs, links, brand accents |
| `--accent` | `#7C3AED` (AI purple) | `#A78BFA` | AI features, gradient endpoint, secondary accent |
| `--background` | `#FFFAF5` (warm cream) | `#0A0E1A` (deep navy) | Page backgrounds |
| `--foreground` | `#2A2420` (warm charcoal) | `#F1F5F9` (near white) | Body text |
| `--card` | `#FFFBF8` | `#0F1629` | Card surfaces |
| `--muted` | `#F7F1E8` | `#141E35` | Subtle backgrounds |
| `--muted-foreground` | `#6B6560` | `#94A3B8` | Secondary text |
| `--border` | `#EDE5D8` | `#1E2A45` | Dividers, borders |
| `--success` | `#10B981` | `#10B981` | Positive states |
| `--warning` | `#F59E0B` | `#F59E0B` | Caution states |
| `--destructive` | `#EF4444` | `#EF4444` | Error states |
| `--trust` | `#29A36B` | `#34D399` | Trust signals, verification |

### The Gradient
```css
background: linear-gradient(135deg, #E53935 0%, #7C3AED 100%);
```
This red-to-purple gradient is the brand's most distinctive visual element. Use it sparingly:
- Hero headline text (`text-gradient`)
- Primary CTA button hover states
- Decorative accent lines
- OG image overlays

Do NOT use it on: body text, large background fills, or anywhere it competes with readability.

---

### Spacing & Layout

| Token | Value | Usage |
|-------|-------|-------|
| Container max-width | 1400px (2xl) | Page content width |
| Container padding | 2rem | Horizontal gutter |
| Section padding | `py-20 md:py-28 lg:py-32` | Vertical rhythm between sections |
| Border radius | 0.75rem (lg), 0.5rem (md), 0.25rem (sm) | Card corners, buttons |

**Assessment**: Spacing is generous and consistent. The `section-padding` utility ensures even vertical rhythm. No changes needed.

**One issue**: The container padding is set to `2rem` in tailwind.config.ts but components use `px-4 md:px-6` (1rem/1.5rem). These don't conflict (px-4 overrides the config) but it's confusing. Standardize on `px-4 md:px-6` in components and remove the config padding.

---

### Component Patterns

#### Cards
```
surface-glass: bg-card/60 backdrop-blur-xl border border-border/50
hover-lift: transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
```
Cards use a frosted glass effect with lift-on-hover. This is visually appealing but:
- `backdrop-blur-xl` is GPU-intensive — on pages with 10+ cards (industry listings), this can cause jank on mid-range devices
- The 60% opacity means card content is harder to read when cards overlap scrolling content

**Recommendation**: Use `bg-card` (solid) for content-heavy cards and reserve `surface-glass` for decorative/hero elements.

#### Buttons
Buttons use shadcn/ui defaults with `rounded-full` override on CTAs. Primary buttons are red (#E82121 area), outline buttons use border-white/20 on dark backgrounds.

**Issue**: The rounded-full pills and the rounded-lg default buttons both appear on the same pages, creating visual inconsistency. Pick one shape language.

**Recommendation**: Use `rounded-full` for all primary CTAs and `rounded-lg` for secondary/utility buttons. Document this distinction.

#### Section Badges
```html
<span class="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider uppercase rounded-full bg-primary/10 text-primary border border-primary/20">
  Badge Text
</span>
```
These eyebrow badges are used consistently via `SectionHeading`. Good pattern — keep it.

#### Hero Pattern
Full-viewport-height hero with background image, dark overlay (`bg-black/60` or gradient), and centered/left-aligned white text. Consistent across PageHero and HeroSlider.

**Issue**: Hero images are loaded as `<img>` tags with `fetchPriority="high"` but no `<source>` or responsive sizing. A 4K hero image downloads at full resolution on mobile.

**Recommendation**: Use `next/image` with `fill` and `sizes` prop, or at minimum add `srcSet` with responsive breakpoints.

---

### Animations

| Animation | Library | Usage |
|-----------|---------|-------|
| `fadeUp` | Framer Motion | Section headings, cards, hero elements |
| `fade-in` | CSS keyframes | Generic fade |
| `slideInRight` | CSS keyframes | Dropdown menus |
| `marquee` | CSS keyframes | Testimonial carousel |
| `float` | CSS keyframes | Decorative elements |
| `accordion-down/up` | CSS keyframes | Radix accordion |

**Issue (flagged in refine.md)**: Nearly every section uses Framer Motion `whileInView` with `fadeUp`. On long pages (industry detail pages have 8-10 sections), the constant "popping in" feels like the page is loading slowly rather than animating gracefully.

**Recommendation:**
- Keep animations on the first 2-3 viewport sections (hero, services, process)
- Below the fold, use CSS `animation: fadeIn 0.3s ease forwards` with `IntersectionObserver` instead of Framer Motion — lighter weight
- Remove animation entirely from dense content sections (FAQ, testimonial grids, feature lists)
- The `marquee` animation on testimonials is good — it's functional, not decorative

---

## 2. Dark Mode

Dark mode is implemented and functional with:
- `next-themes` for toggle state
- CSS variable overrides in `.dark` class
- `ThemeToggle` component in navbar
- `section-alt` utility that inverts to dark surfaces in light mode and even darker in dark mode

**Issue**: The `section-alt` utility forces dark styling in light mode (warm charcoal background `20 14% 15%`). This is a bold design choice that works for visual contrast, but it means the "light mode" experience is actually a mixed light/dark layout. This can feel disorienting.

**Recommendation**: Keep `section-alt` but soften it in light mode. Instead of going full dark, use the warm cream palette at a deeper shade:
```css
.section-alt {
  --background: 33 40% 92%;  /* warm gray instead of dark charcoal */
  --card: 33 40% 95%;
  --muted-foreground: 20 10% 45%;
  --border: 33 30% 82%;
}
```
This maintains visual rhythm without the jarring light-dark-light-dark striping.

---

## 3. Responsive Design

### Breakpoints (Tailwind defaults)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1400px (container max)

### Mobile Observations
- Navbar collapses to a hamburger at `lg` (1024px) — good threshold
- Mobile menu is a full-screen overlay with accordion navigation — well implemented
- Hero text scales from `text-4xl` to `text-7xl` — appropriate range
- Cards stack to single column on mobile — correct
- Container gutters shrink from 24px to 16px on mobile — could be tighter on small phones

### Issues
- **Industry mega-menu**: 200 items in accordion on mobile. Even with nested accordions, this is overwhelming. Most users won't scroll through 20 categories x 10 items
- **WhatsApp popup**: Always visible on mobile — can obscure content and feels aggressive

### Recommendations
- On mobile, replace the industry mega-menu with a search bar + top 5 featured industries
- Make the WhatsApp popup dismissible and don't show it for the first 30 seconds of a session
- Test hero text at 320px viewport width — `text-4xl` (2.25rem/36px) may need to drop to `text-3xl` on very small screens

---

## 4. Accessibility

### Current State
- ~~No skip-navigation link~~ **FIXED** — Skip-to-content link added in layout.tsx (`<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>`)
- No ARIA labels on many interactive elements (flagged in refine.md)
- Color contrast concerns with `muted-foreground` on light backgrounds
- Keyboard navigation incomplete for mega-menus

### Contrast Check (approximate, updated for `#E53935` brand red)

| Text | Background | Ratio | WCAG AA |
|------|-----------|-------|---------|
| `#2A2420` on `#FFFAF5` | Body text | ~14:1 | Pass |
| `#6B6560` on `#FFFAF5` | Muted text | ~5.2:1 | Pass |
| `#94A3B8` on `#FFFAF5` | Subtle text | ~3.1:1 | **Fail** (needs 4.5:1) |
| `#E53935` on `#FFFAF5` | Brand links | ~4.5:1 | **Borderline-pass** (improved from `#E82121`) |
| `#FFFFFF` on `#E53935` | Button text | ~4.2:1 | **Borderline** |

### Recommendations
- ~~Add skip-nav link~~ **DONE** — added in layout.tsx
- Darken `--text-subtle` from `#94A3B8` to `#6B7B8D` to meet AA — **NOT DONE**
- `#E53935` improves contrast over the old `#E82121` — now borderline-passing on light backgrounds. For critical text links, consider darkening to `#C41B1B` or ensuring sufficient font size (18px+)
- Add `aria-label` to all icon-only buttons (search, theme toggle, mobile menu) — **NOT DONE**
- Implement focus trap in mega-menu and mobile menu — **NOT DONE**

---

## 5. Performance Considerations

### Current Weight Concerns
- **Three.js** (HeroGlobe, ParticleNetwork): ~500KB+ for decorative effects. **Both components are currently unused** — no page imports them, but they remain in the bundle if tree-shaking doesn't fully eliminate them
- **Framer Motion** (v12.34.3): ~100KB for 78 `whileInView` animations that could largely be CSS
- **GSAP** (v3.14.2): Additional animation library running parallel to Framer Motion — dual animation libraries add unnecessary weight
- **@fontsource packages**: Legacy `@fontsource/inter` and `@fontsource/space-grotesk` still in package.json — no longer the active fonts
- **industries-generated.ts**: 34K lines loaded on every industry page
- **Navbar.tsx**: ~37KB single component handling mega-menu with 200+ industry items

### Recommendations
1. **Remove HeroGlobe.tsx and ParticleNetwork.tsx** entirely — they are unused. If needed later, re-add with `dynamic(() => import('./HeroGlobe'), { ssr: false })`
2. **Pick one animation library**: Either Framer Motion or GSAP, not both. Framer Motion is more idiomatic for React — migrate GSAP usages or vice versa
3. **Replace Framer Motion** with CSS animations for simple fade/slide effects. Keep FM only for complex interactions (accordion, menu transitions)
4. **Remove @fontsource packages** — `next/font/google` handles Bricolage Grotesque + Sora
5. **Split industry data** by category so each page loads only its own data (~1.7K lines instead of 34K)
6. **Add responsive image sources** to hero images — serve WebP at appropriate sizes
7. **Extract mega-menu data** from Navbar.tsx to reduce component size and improve maintainability

---

## 6. Design Tokens — Recommended Final System

### File: `src/styles/globals.css` (single source of truth)

```
:root {
  /* Brand */
  --brand:           #E53935;
  --brand-dark:      #C62828;
  --brand-light:     #EF5350;
  --accent:          #7C3AED;
  --accent-light:    #A78BFA;

  /* Gradient */
  --gradient:        linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%);

  /* Surfaces (light) */
  --bg:              #FFFAF5;
  --surface:         #FFFBF8;
  --surface-2:       #F7F1E8;
  --card:            #FFFFFF;

  /* Text (light) */
  --text:            #2A2420;
  --text-muted:      #6B6560;
  --text-subtle:     #6B7B8D;  /* darkened for a11y */

  /* Borders (light) */
  --border:          #EDE5D8;
  --border-strong:   #D9CBBC;

  /* Semantic */
  --success:         #10B981;
  --warning:         #F59E0B;
  --danger:          #EF4444;
  --info:            #4FA3FF;

  /* Spacing */
  --radius:          0.75rem;
}

.dark {
  --bg:              #0A0E1A;
  --surface:         #0F1629;
  --surface-2:       #141E35;
  --card:            #111827;
  --text:            #F1F5F9;
  --text-muted:      #94A3B8;
  --text-subtle:     #64748B;
  --border:          #1E2A45;
  --border-strong:   #2A3A58;
}
```

---

## 7. Design Debt & Cleanup Priorities

| # | Issue | Severity | Status (2026-04-22) | Fix |
|---|-------|----------|---------------------|-----|
| 1 | Two CSS files with conflicting color definitions | High | **IN PROGRESS** — Primary red aligned to `#E53935` but legacy `--color-brand` (`#E82121`) still exists in app/globals.css | Consolidate into styles/globals.css, remove app/globals.css |
| 2 | Double font loading (next/font + @fontsource) | Medium | **PARTIAL** — next/font now loads Bricolage Grotesque + Sora, but legacy @fontsource packages still in package.json | Remove @fontsource packages and imports |
| 3 | `section-alt` creates jarring light/dark striping | Medium | **NOT DONE** | Soften to warm gray in light mode |
| 4 | `surface-glass` on content cards causes GPU strain | Medium | **NOT DONE** | Use solid `bg-card` for content cards |
| 5 | Mixed button radius (rounded-full vs rounded-lg) | Low | **NOT DONE** | Standardize: pill for CTAs, rounded-lg for utility |
| 6 | No responsive image handling for heroes | Medium | **NOT DONE** — Heroes still use plain `<img>` tags | Use next/image with `fill` + `sizes`, or add `srcSet` |
| 7 | Animation overuse below the fold (78 `whileInView` instances) | Low | **NOT DONE** | Limit Framer Motion to top 3 sections, use CSS below fold |
| 8 | `--text-subtle` fails WCAG AA contrast | High | **NOT DONE** | Darken from `#94A3B8` to `#6B7B8D` |
| 9 | Skip-nav + ARIA labels | High | **PARTIAL** — Skip-to-content link added. ARIA labels on icon buttons still missing. | Audit all interactive elements for ARIA |
| 10 | Three.js loaded without dynamic import | Medium | **NOT DONE** — HeroGlobe.tsx and ParticleNetwork.tsx exist but are unused. ~500KB+ bundle weight. | Remove if unused, or wrap in `dynamic({ ssr: false })` |

---

## 8. Visual Identity Checklist

What exists today vs. what a mature brand needs:

| Asset | Status (2026-04-22) | Action |
|-------|---------------------|--------|
| Wordmark (Ciro**Stack**) | Exists (text-only in code) | Formalize as SVG |
| Logo icon | Exists (logo.png, small) | Redesign as scalable SVG |
| Favicon | Exists (.ico + .png) | Ensure consistency with new logo |
| OG image | Generic hero-bg.jpg | Create branded template with logo + gradient |
| Color palette | **Partially consolidated** — primary red settled at `#E53935`, but legacy hex vars remain | Complete consolidation (see section 6) |
| Typography scale | **Updated** — Bricolage Grotesque + Sora via Tailwind config | Document heading sizes + line heights |
| Icon style | Lucide (consistent) | Good — no change needed |
| Illustration style | None | Consider light line illustrations for empty states and error pages |
| Photography style | Stock images, generic | Define a photo direction: diverse teams, real workspaces, warm lighting |
| Motion language | Exists but overused (78 `whileInView` animations) | Define when to animate vs. when to be static |
| Email templates | None visible | Create branded templates for contact form confirmations and newsletter |
| Social media templates | None visible | Create templates for blog post sharing, case study announcements |
| Pitch deck template | None visible | Create branded slide deck for sales calls |
