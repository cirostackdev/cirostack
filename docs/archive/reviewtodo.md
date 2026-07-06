# Code Review & Todo

**Last updated:** 2026-04-16  
**Build status:** 238 static pages generated  
**Overall:** Migration complete. Grouped static routes in place. Items below are polish and architecture improvements.

---

## HIGH

### 1. Extract blog post data from BlogPost.tsx into data layer
**Files:** `src/pages-src/BlogPost.tsx:25-950`, `src/pages-src/ServiceDetail.tsx:27-28`

`posts` and `postImages` are defined inside `BlogPost.tsx` (a client component). `ServiceDetail` cross-imports them. This couples page components and prevents server-side metadata generation.

**Fix:**
- Create `src/data/blogPosts.ts` — move `posts`, `postImages`, `ContentBlock`, `BlogPostEntry` types there
- Update imports in `BlogPost.tsx`, `ServiceDetail.tsx`
- Update `src/app/blog/[id]/page.tsx` `generateMetadata` to import from `data/blogPosts.ts` and return real titles (currently returns generic placeholder)

---

### 2. Dynamic import Three.js components with `ssr: false`
**Files:** `src/components/HeroGlobe.tsx`, `src/components/ParticleNetwork.tsx`

Both use `@react-three/fiber` Canvas + WebGL. Marked `"use client"` but not wrapped in `dynamic()`. If ever imported by a server component, the build breaks.

**Fix:** Create `HeroGlobeDynamic.tsx` and `ParticleNetworkDynamic.tsx` wrappers:
```tsx
"use client";
import dynamic from "next/dynamic";
export default dynamic(() => import("./HeroGlobe"), { ssr: false });
```

---

### 3. Replace static sitemap/robots with Next.js generation
**Files:** `public/sitemap.xml`, `public/robots.txt`

Static files from original Vite build — stale. Create `src/app/sitemap.ts` and `src/app/robots.ts` to auto-generate from data files, then delete the static versions.

---

## MEDIUM

### 4. Canonicalize the base URL
**File:** `src/app/layout.tsx:22`

`metadataBase` is hardcoded to `https://cirostack.lovable.app`. Move to env var:
```
NEXT_PUBLIC_SITE_URL=https://www.cirostack.com
```
Also update Twitter handle from `@Lovable` to CiroStack's own handle, and replace the OG image URL (currently points to `storage.googleapis.com/gpt-engineer-file-uploads/...`).

---

### 5. Move Suspense boundary into Portfolio component
**Files:** `src/app/portfolio/page.tsx`, `src/pages-src/Portfolio.tsx`

The `<Suspense>` for `useSearchParams` is in the route file. Move it inside `Portfolio.tsx` so the requirement is self-contained.

---

### 6. Consolidate duplicate use-toast
**Files:** `src/hooks/use-toast.ts`, `src/components/ui/use-toast.ts`

Two copies of the toast hook exist. Determine which is canonical (likely `src/hooks/use-toast.ts` at 4KB), update all imports, and delete the other.

---

### 7. Wire up dark mode or remove next-themes
**Files:** `src/styles/globals.css`, `src/app/providers.tsx`, `package.json`

`next-themes` is installed but unused. CSS variables only define light mode. Either:
- Add dark mode CSS variables + ThemeProvider in providers.tsx + toggle in Navbar
- Or remove `next-themes` from dependencies

---

## LOW

### 8. Enable TypeScript strict checks incrementally
**File:** `tsconfig.json`

Currently `strict: false`, `noImplicitAny: false`. Re-enable one at a time: `noUnusedLocals` → `noImplicitAny` → `strict`.

---

### 9. Remove `ignoreBuildErrors` after image type workaround is resolved
**File:** `next.config.ts`

`typescript: { ignoreBuildErrors: true }` masks all TS errors during build. The webpack `asset/resource` fix makes images work at runtime, but Next.js's global `.d.ts` still declares them as `StaticImageData`. Ideally, override the global types cleanly or migrate to `next/image`.

---

### 10. Delete unused files
- `src/pages-src/BlankPage.tsx` — "Coming Soon" placeholder, verify if any route imports it
- Duplicate `use-toast.ts` (see item 6)
- Root-level build artifacts (`extract.cjs/js/mjs/py` if present)

---

### 11. Initialize git repository
No version control. Set up git with appropriate `.gitignore` for Next.js project.

---

## DONE

| Item | Status |
|---|---|
| react-router-dom fully removed | Done |
| `to=` → `href=` on all Links | Done |
| `useLocation` / `useNavigate` replaced | Done |
| `react-helmet-async` / `HelmetProvider` removed | Done |
| `"use client"` on all interactive components | Done |
| Providers (QueryClient, Tooltip, Toaster, Sonner) in providers.tsx | Done |
| Font loading via `next/font/google` | Done |
| Scroll-to-top handled by Next.js | Done |
| All original routes wired in `app/` (238 pages) | Done |
| `useSearchParams` wrapped in Suspense (Portfolio) | Done |
| CSS variables identical to original | Done |
| PostCSS config in CommonJS format | Done |
| Static export (`output: "export"`) working | Done |
| Image imports return string URLs (webpack fix) | Done |
| Services as file-based routes in 5 Route Groups | Done |
| Industries as file-based routes in 20 Route Groups | Done |
| ServiceDetail/Industry use `usePathname` (not `useParams`) | Done |
| Route Group structure mirrors Navbar menu hierarchy | Done |
| `projectImages` moved to `caseStudies.ts` (data layer) | Done |
| Pricing page routed at `/pricing` | Done |
| WhatsApp popup integrated in root layout | Done |
