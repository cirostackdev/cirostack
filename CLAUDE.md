# CLAUDE.md — Project Context for AI Assistants

## Project Overview
**CiroStack** is a software development agency website. Originally a Vite + React Router SPA, it has been migrated to **Next.js 15 (App Router)** with static export. The site showcases services, industry expertise, case studies, blog posts, and team — targeting business decision-makers seeking custom software, web/mobile apps, and AI automation.

## Tech Stack
- **Framework**: Next.js 15.3.1 (App Router) + React 18.3.1 + TypeScript 5
- **Output**: Static export (`output: "export"`, `trailingSlash: true` → `out/` directory)
- **Styling**: Tailwind CSS v3.4 with semantic HSL design tokens (defined in `src/styles/globals.css` and `tailwind.config.ts`)
- **UI Components**: shadcn/ui (Radix primitives, 40+ components) in `src/components/ui/`
- **Animations**: Framer Motion 12 + GSAP 3.14
- **3D**: Three.js 0.183 + @react-three/fiber + @react-three/drei (HeroGlobe, ParticleNetwork)
- **SEO**: Next.js `generateMetadata` / static `metadata` exports (replaces react-helmet)
- **Icons**: Lucide React
- **Fonts**: Space Grotesk (display) + Inter (body) via `next/font/google`
- **Forms**: React Hook Form + Zod
- **Data Fetching**: @tanstack/react-query 5
- **Charts**: Recharts 2.15
- **Carousel**: Embla Carousel
- **Toast**: Sonner + Radix Toast
- **Testing**: Vitest
- **Package manager**: Bun

## Common Commands
```bash
bun install          # Install dependencies
bun run dev          # Dev server
bun run build        # Production build → out/
bun run start        # Serve production build
bun run test         # Run tests (vitest)
bun run test:watch   # Run tests in watch mode
bun run lint         # Next.js lint
```

## Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router (238 page.tsx files total)
│   ├── layout.tsx          # Root layout (Navbar + Footer + WhatsApp + Providers)
│   ├── providers.tsx       # Client-side providers (QueryClient, TooltipProvider, Toaster, Sonner)
│   ├── page.tsx            # Home (/)
│   ├── not-found.tsx       # 404
│   ├── about/page.tsx      # Static pages (~17 total)
│   ├── services/
│   │   ├── page.tsx        # Services listing
│   │   ├── (ideate)/       # Route Group — URL stays /services/*
│   │   │   ├── websites/page.tsx
│   │   │   ├── ux-ui-design/page.tsx
│   │   │   └── cloud-consulting/page.tsx
│   │   ├── (build)/        # 4 services
│   │   ├── (improve)/      # 4 services
│   │   ├── (operate)/      # 5 services
│   │   └── (scale)/        # 3 services
│   ├── industries/
│   │   ├── (retail-and-ecommerce)/      # 10 industries
│   │   ├── (healthcare-and-medical)/    # 10 industries
│   │   ├── ... (20 route groups × 10 = 200 pages)
│   │   └── (small-business)/            # 10 industries
│   ├── portfolio/
│   │   ├── page.tsx        # Portfolio listing
│   │   └── [id]/page.tsx   # Dynamic — 25 case studies (SSG)
│   ├── blog/
│   │   ├── page.tsx        # Blog listing
│   │   └── [id]/page.tsx   # Dynamic — 16 blog posts (SSG)
│   └── ...                 # Other static pages (pricing, newsroom, events, etc.)
├── pages-src/              # Original page components (23 files, all "use client")
│   ├── Index.tsx, About.tsx, Contact.tsx, etc.
│   ├── ServiceDetail.tsx   # Renders service pages (reads slug from usePathname)
│   ├── Industry.tsx        # Renders industry pages (reads slug from usePathname)
│   ├── CaseStudy.tsx       # Renders case studies (reads id from useParams)
│   ├── BlogPost.tsx        # Renders blog posts (reads id from useParams)
│   ├── Pricing.tsx         # Pricing page (service tiers + FAQs)
│   ├── Newsroom.tsx        # Press releases, awards, media coverage
│   └── BlankPage.tsx       # "Coming Soon" placeholder
├── components/             # Shared components (92 files)
│   ├── Navbar.tsx          # Multi-level mega menu (~37KB)
│   ├── Footer.tsx
│   ├── Layout.tsx          # Pass-through stub (layout is in app/layout.tsx)
│   ├── SEO.tsx             # Null stub (SEO is via Next.js metadata)
│   ├── ScrollToTop.tsx     # Null stub (Next.js scrolls to top automatically)
│   ├── HeroSlider.tsx, HeroGlobe.tsx, ParticleNetwork.tsx
│   ├── PageHero.tsx, SectionHeading.tsx, TestimonialsMarquee.tsx
│   ├── MultiSelectFilter.tsx, NavLink.tsx
│   ├── WhatsAppPopup.tsx   # Active — integrated in root layout
│   ├── services/           # Service page section components (11 files)
│   ├── industries/         # Industry page section components (13 files)
│   ├── case-study/         # Case study section components (6 files)
│   └── ui/                 # shadcn/ui primitives (40+ files) — do not edit directly
├── data/                   # Static data (no backend)
│   ├── services/           # part1.ts–part4.ts, types.ts, index.ts
│   ├── industries.ts       # Base industries config
│   ├── industries-generated.ts   # 200 industry entries (~34K lines)
│   ├── industry-stats-map.ts     # Statistics per industry
│   ├── caseStudies.ts      # 25 case studies + projectImages (image map)
│   └── testimonials.ts
├── hooks/                  # use-mobile.tsx, use-toast.ts
├── lib/utils.ts            # cn() utility
├── styles/globals.css      # Tailwind + CSS variables + custom utilities (light mode only)
├── types/images.d.ts       # Image import type declarations
└── assets/                 # Static images (153 files — JPG/PNG, served via webpack asset/resource)
```

### Routing Model (238 pages total)
- **Services** (19): File-based static routes organized in Route Groups matching the Navbar categories — `(ideate)`, `(build)`, `(improve)`, `(operate)`, `(scale)`. Each page imports `ServiceDetail` from `pages-src/`.
- **Industries** (200): File-based static routes in 20 Route Groups matching the Navbar categories. Each page imports `Industry` from `pages-src/`.
- **Portfolio** (25): Dynamic `[id]` route with `generateStaticParams`.
- **Blog** (16): Dynamic `[id]` route with `generateStaticParams`.
- **Static pages** (~17): about, contact, pricing, careers, newsroom, events, newsletter, our-culture, resources, sustainability, privacy, terms, thank-you, etc.

Route Groups use `(parentheses)` directories — they organize the filesystem without changing URLs. `/services/websites` maps to `app/services/(ideate)/websites/page.tsx`.

### How Page Components Resolve Their Slug
- `ServiceDetail.tsx` and `Industry.tsx` use `usePathname()` and extract the slug from the URL path (last segment).
- `CaseStudy.tsx` and `BlogPost.tsx` use `useParams()` (dynamic `[id]` routes).

### Image Handling
In `next.config.ts`, the default `next-image-loader` is replaced with webpack's `asset/resource` type. This makes image imports return plain URL strings (matching Vite behavior) instead of `StaticImageData` objects. All `<img src={importedImage}>` usages depend on this.

### Data Layer (no backend — all static)
- `src/data/services/` — 19 service definitions split across `part1.ts`–`part4.ts`, typed in `types.ts`
- `src/data/industries.ts` — Base industry configuration
- `src/data/industries-generated.ts` — 200 industry entries (~34K lines) with `IndustryEntry` type
- `src/data/industry-stats-map.ts` — Statistics mapping per industry
- `src/data/caseStudies.ts` — 25 case studies with full project details + `projectImages` map
- `src/data/testimonials.ts` — Client testimonials
- `src/pages-src/BlogPost.tsx` — 16 blog posts defined inline (should be extracted to `data/`)

### Design System
- All colors use HSL CSS custom properties: `--primary`, `--background`, `--foreground`, `--muted`, `--accent`, `--trust`, etc.
- Custom utilities: `surface-glass`, `glow-border`, `hover-lift`, `section-padding`, `section-alt`, `text-gradient`
- Never use raw color values — always reference semantic tokens

### Mega Menu Navigation (`src/components/Navbar.tsx`)
Complex multi-level mega menu with:
- 5 service categories (Ideate, Build, Improve, Operate, Scale) → 19 services
- 20 industry categories → 200 industry pages
- Active page highlighting

## Key Conventions
1. **Pricing page exists** — `src/pages-src/Pricing.tsx` is routed at `/pricing` with service tiers (no dollar amounts, focus on scope/features)
2. **Customer-facing tone** — content speaks to business decision-makers, not developers
3. **No backend** — purely static. No API calls. Contact form uses toast + redirect to /thank-you (no real submission)
4. **"use client"** — all components in `components/` and `pages-src/` are client components
5. **Stub components** — `Layout.tsx`, `SEO.tsx`, `ScrollToTop.tsx` are no-op stubs kept for import compatibility. Do not add logic to them.
6. **Route generation** — `scripts/generate-static-routes.mjs` generates the 219 service/industry page files. Run it if data changes.
7. **No version control** — project does not currently have a git repository initialized
8. **metadataBase** — hardcoded to `https://cirostack.lovable.app` in `src/app/layout.tsx` (should be updated to production URL)

## File Size Warnings
- `src/data/industries-generated.ts` — ~34K lines, 200 entries
- `src/data/caseStudies.ts` — ~1,320 lines, 25 entries
- `src/components/Navbar.tsx` — ~37KB (mega menu logic)
- `src/pages-src/BlogPost.tsx` — ~950 lines (16 blog posts inline)
- `src/components/WhatsAppPopup.tsx` — ~16KB (popup + session tracking)
