  ---
  CiroStack Website — Master Plan

  Phase 1 — Fix Before Launch (Blockers)

  1. Credibility cleanup
  - Replace $2.5M seed round press release and all fictional newsroom entries — remove or mark as placeholder      
  - Remove/replace fabricated testimonials with a "Coming soon" state
  - Fix metadataBase in src/app/layout.tsx:22 — change from cirostack.lovable.app to env var
  NEXT_PUBLIC_SITE_URL=https://www.cirostack.com
  - Fix Twitter handle from @Lovable to CiroStack's own
  - Replace OG image pointing to storage.googleapis.com/gpt-engineer-file-uploads/... with self-hosted image       

  2. SEO foundation
  - Delete public/sitemap.xml (stale Vite artifact), create src/app/sitemap.ts auto-generated from route/data files
  - Create src/app/robots.ts to replace static public/robots.txt
  - Add canonical URLs to all pages

  ---
  Phase 2 — Code Architecture (High Priority)

  3. Extract blog data (reviewtodo.md item 1)
  - Move posts, postImages, types out of BlogPost.tsx → src/data/blogPosts.ts
  - Fix cross-import in ServiceDetail.tsx
  - Update blog/[id]/page.tsx generateMetadata to use real titles

  4. Three.js dynamic wrappers (reviewtodo.md item 2)
  - Wrap HeroGlobe.tsx and ParticleNetwork.tsx with dynamic(() => import(...), { ssr: false }) to prevent SSR build
   breaks

  5. Consolidate duplicate toast (reviewtodo.md item 6)
  - Keep src/hooks/use-toast.ts, delete src/components/ui/use-toast.ts, update all imports

  6. Suspense boundary (reviewtodo.md item 5)
  - Move <Suspense> for useSearchParams inside Portfolio.tsx

  7. Cleanup unused files
  - Delete src/pages-src/BlankPage.tsx
  - Remove root-level extract.cjs/js/mjs/py build artifacts

  ---
  Phase 3 — Performance

  8. Split industries-generated.ts (~34K lines, 200 entries all bundled)
  - Split into per-category files: src/data/industries/retail.ts, healthcare.ts, etc.
  - Extract IndustryEntry type to src/data/industries/types.ts
  - Implement lazy loading so only the visited category loads

  9. Reorganize service data
  - Consolidate part1.ts–part4.ts into category-based files (Ideate, Build, Improve, Operate, Scale)

  ---
  Phase 4 — Content (Ongoing)

  10. Rewrite 16 remaining industry categories (160 pages)
  Priority order based on likely traffic:
  1. Technology & Startups
  2. Legal Services
  3. Professional Services
  4. Small Business
  5. Construction & Engineering
  6. Transportation & Logistics
  7. Manufacturing & Industrial
  8. Media & Entertainment
  9. Education & E-Learning
  10. Hospitality & Tourism
  11. Beauty & Personal Care
  12. Sports & Recreation
  13. Non-Profit & Social Enterprise
  14. Government & Public Sector
  15. Agriculture & Farming
  16. Automotive

  Each page: customer-facing language, CiroStack services mapped to pain points, stats, FAQs, reviews.

  ---
  Phase 5 — Features

  11. Contact form — wire to real submission handler (Formspree is the fastest path; Supabase if already in stack) 

  12. Search — wire up existing ui/command.tsx (Radix Command) to the navbar search icon, index
  service/industry/blog content

  13. Analytics — add Google Analytics or Umami; add cookie consent banner

  14. Dark mode — either wire next-themes with CSS dark variables + toggle in Navbar, or remove the dependency     
  entirely

  ---
  Phase 6 — Quality

  15. Accessibility
  - Add skip-to-content link
  - Keyboard trap handling in mega menu
  - ARIA labels on interactive elements
  - Verify WCAG AA color contrast on muted-foreground

  16. TypeScript strictness (incremental)
  - noUnusedLocals → noImplicitAny → strict: true
  - Remove ignoreBuildErrors: true from next.config.ts once image types are resolved

  ---
  Suggested order of attack:
  Phase 1 (credibility/SEO blockers) → Phase 2 (architecture) → Phase 3 (performance) → Phase 4 (content,
  parallelizable) → Phase 5 (features) → Phase 6 (quality)