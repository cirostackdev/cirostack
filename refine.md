# Refine.md — Areas for Improvement

## Content Quality
- **Industry pages (16 remaining categories)**: Templated content with keyword injection reads as generic and unconvincing. Each page should tell a story about how CiroStack specifically solves that industry's problems, referencing actual services and realistic outcomes. 4 of 20 categories have been rewritten (Retail & E-Commerce, Healthcare & Medical, Financial Services, Real Estate & Property).
- **Case studies**: The 25 case studies are well-structured but fictional. As real projects are completed, these should be replaced or supplemented with actual client work.
- **Testimonials**: Currently fabricated. Replace with real client quotes as they become available.
- **Newsroom**: Contains fictional press releases and media coverage (including a "$2.5M seed round" announcement from Feb 2026). Should either be populated with real news or removed to avoid credibility issues.
- **Blog posts**: 16 posts hardcoded in `BlogPost.tsx`. Content is reasonable but should be reviewed for accuracy and kept current (e.g., "Web Design Trends 2026").

## Design & UX
dont alter the desktop or mobile menu
- **Page load performance**: Every industry page loads the full ~34K-line industries data file. Implement route-based code splitting so only the relevant industry entry is loaded.
- **Hero images**: Industry pages share a single generic hero image (`hero-industry.jpg`). The data references unique per-industry hero images (`/images/industries/hero-[slug].jpg`) but these may not all exist yet.
- **Animation overuse**: Nearly every section uses Framer Motion fade-up animations. On long pages (industry/service detail), this creates a "popping in" effect that can feel slow. Consider reducing animation on below-fold content.
- **Dark mode**: CSS variables are light-mode only — no dark mode defined and no user-facing toggle. `next-themes` is installed but not wired up.
- **Search**: Navbar has a search icon and `ui/command.tsx` exists (Radix Command), but no functional search is implemented.

## Code Architecture
- **Data file size**: `industries-generated.ts` is a monolithic ~34K-line file with 200 entries. Split by category (e.g., `industries/retail.ts`, `industries/healthcare.ts`) for maintainability and tree-shaking.
- **Blog data coupling**: `posts` and `postImages` are defined inside `BlogPost.tsx` (a client component). `ServiceDetail.tsx` cross-imports them. Extract to `src/data/blogPosts.ts` for separation of concerns and server-side metadata generation.
- **Type duplication**: `IndustryEntry` type is defined inline in `industries-generated.ts` rather than in a shared types file. Extract to `src/data/industries/types.ts`.
- **Service data fragmentation**: Services are split across `part1.ts`–`part4.ts` with no clear organizational logic. Reorganize by category (Ideate, Build, Improve, Operate, Scale).
- **Navbar complexity**: At ~37KB, the Navbar component handles too many concerns (mega menu state, mobile drawer, search, active page tracking). Extract mega menu into a separate component.
- **Three.js SSR risk**: `HeroGlobe.tsx` and `ParticleNetwork.tsx` use WebGL but lack `dynamic(() => import(...), { ssr: false })` wrappers. If ever imported by a server component, the build breaks.
- **Duplicate toast**: `use-toast.ts` exists in both `src/hooks/` and `src/components/ui/` — should be consolidated.
- **Unused files**: `BlankPage.tsx` is a placeholder stub. Root `extract.cjs/js/mjs/py` and generation scripts in `scripts/` are likely development artifacts that can be cleaned up.

## SEO & Marketing
- **Structured data**: Add JSON-LD schema markup for Organization, Service, and FAQ schemas on relevant pages.
- **Internal linking**: Industry pages don't cross-link to related services or case studies effectively. Add contextual CTAs that link to the most relevant service pages.
- **Meta descriptions**: Ensure all 200 industry pages have unique, compelling meta descriptions (not just the page title repeated).
- **Canonical tags**: Add canonical URLs to prevent duplicate content issues.
- **Open Graph images**: Generate unique OG images for each service/industry page for better social sharing. Current OG image points to a Google Cloud Storage upload.
- **Sitemap**: Static `public/sitemap.xml` is stale (from Vite build). Should be auto-generated via `src/app/sitemap.ts`.
- **metadataBase**: Hardcoded to `https://cirostack.lovable.app` — needs to be updated to production URL.
- **Twitter metadata**: References `@Lovable` — should reference CiroStack's own handle.

## Functionality
- **Contact form**: Needs real submission handling (email notification, CRM integration, or at minimum a form service like Formspree). Currently shows a toast and redirects to /thank-you.
- **Search**: The navbar has a search icon but no search functionality implemented. Radix Command component exists in `ui/` but is unused.
- **Analytics**: No Google Analytics, Umami, or other analytics integration visible in the codebase.
- **Cookie consent**: No cookie consent banner exists despite potential analytics tracking needs.
- **404 handling**: NotFound page exists but could be improved with suggested links and search.
- **Version control**: No git repository initialized — should set up git for change tracking and deployment.

## Accessibility
- **Keyboard navigation**: The mega menu needs keyboard trap handling and proper focus management.
- **ARIA labels**: Many interactive elements lack proper ARIA attributes.
- **Color contrast**: Verify that `muted-foreground` text meets WCAG AA contrast ratios against all background variants.
- **Skip navigation**: No skip-to-content link for keyboard users.
- **Image alt text**: Many portfolio and hero images may have generic or missing alt text.
