# Industries to Startups - Implementation Plan

## Overview

Restructure the `Industries` nav item into `Startups`, replacing 20 broad industry categories with 6 startup-native dimensions (60 subcategories total). The existing page template and hover interaction remain unchanged.

---

## Phase 1: Route & Directory Setup

### 1.1 Create new directory structure

```
src/app/startups/
  by-stage/
    page.tsx          (category landing)
  by-vertical/
    page.tsx
  by-product/
    page.tsx
  by-founder/
    page.tsx
  by-challenge/
    page.tsx
  by-engagement/
    page.tsx
```

### 1.2 Create subcategory page directories

Create a `page.tsx` inside each of the 60 subcategory routes using the same template pattern as existing industry subcategory pages (e.g., `/industries/(technology-and-startups)/tech-startups/page.tsx`).

**By Stage (10 pages):**
- `src/app/startups/(by-stage)/pre-idea/page.tsx`
- `src/app/startups/(by-stage)/validation/page.tsx`
- `src/app/startups/(by-stage)/mvp/page.tsx`
- `src/app/startups/(by-stage)/early-traction/page.tsx`
- `src/app/startups/(by-stage)/seed-stage/page.tsx`
- `src/app/startups/(by-stage)/series-a/page.tsx`
- `src/app/startups/(by-stage)/series-b-plus/page.tsx`
- `src/app/startups/(by-stage)/bootstrapped/page.tsx`
- `src/app/startups/(by-stage)/growth/page.tsx`
- `src/app/startups/(by-stage)/scale-up/page.tsx`

**By Vertical (10 pages):**
- `src/app/startups/(by-vertical)/fintech/page.tsx`
- `src/app/startups/(by-vertical)/healthtech/page.tsx`
- `src/app/startups/(by-vertical)/edtech/page.tsx`
- `src/app/startups/(by-vertical)/proptech/page.tsx`
- `src/app/startups/(by-vertical)/legaltech/page.tsx`
- `src/app/startups/(by-vertical)/agritech/page.tsx`
- `src/app/startups/(by-vertical)/logistics-tech/page.tsx`
- `src/app/startups/(by-vertical)/ecommerce/page.tsx`
- `src/app/startups/(by-vertical)/b2b-saas/page.tsx`
- `src/app/startups/(by-vertical)/consumer-apps/page.tsx`

**By Product Type (10 pages):**
- `src/app/startups/(by-product)/web-app/page.tsx`
- `src/app/startups/(by-product)/mobile-app/page.tsx`
- `src/app/startups/(by-product)/ai-product/page.tsx`
- `src/app/startups/(by-product)/saas-platform/page.tsx`
- `src/app/startups/(by-product)/marketplace/page.tsx`
- `src/app/startups/(by-product)/api-product/page.tsx`
- `src/app/startups/(by-product)/data-platform/page.tsx`
- `src/app/startups/(by-product)/iot/page.tsx`
- `src/app/startups/(by-product)/internal-tools/page.tsx`
- `src/app/startups/(by-product)/embedded/page.tsx`

**By Founder Type (10 pages):**
- `src/app/startups/(by-founder)/non-technical-founder/page.tsx`
- `src/app/startups/(by-founder)/first-time-founder/page.tsx`
- `src/app/startups/(by-founder)/solo-founder/page.tsx`
- `src/app/startups/(by-founder)/repeat-founder/page.tsx`
- `src/app/startups/(by-founder)/student-startup/page.tsx`
- `src/app/startups/(by-founder)/corporate-innovator/page.tsx`
- `src/app/startups/(by-founder)/female-led/page.tsx`
- `src/app/startups/(by-founder)/african-startup/page.tsx`
- `src/app/startups/(by-founder)/diaspora-founder/page.tsx`
- `src/app/startups/(by-founder)/social-enterprise/page.tsx`

**By Challenge (10 pages):**
- `src/app/startups/(by-challenge)/fast-mvp/page.tsx`
- `src/app/startups/(by-challenge)/scaling-tech/page.tsx`
- `src/app/startups/(by-challenge)/agency-rescue/page.tsx`
- `src/app/startups/(by-challenge)/fundraising-ready/page.tsx`
- `src/app/startups/(by-challenge)/ai-integration/page.tsx`
- `src/app/startups/(by-challenge)/tech-debt/page.tsx`
- `src/app/startups/(by-challenge)/security-compliance/page.tsx`
- `src/app/startups/(by-challenge)/post-pivot/page.tsx`
- `src/app/startups/(by-challenge)/no-tech-team/page.tsx`
- `src/app/startups/(by-challenge)/africa-launch/page.tsx`

**By Engagement (10 pages):**
- `src/app/startups/(by-engagement)/fixed-price-mvp/page.tsx`
- `src/app/startups/(by-engagement)/dedicated-team/page.tsx`
- `src/app/startups/(by-engagement)/tech-cofounder/page.tsx`
- `src/app/startups/(by-engagement)/cto-as-a-service/page.tsx`
- `src/app/startups/(by-engagement)/design-sprint/page.tsx`
- `src/app/startups/(by-engagement)/code-audit/page.tsx`
- `src/app/startups/(by-engagement)/staff-augmentation/page.tsx`
- `src/app/startups/(by-engagement)/retainer/page.tsx`
- `src/app/startups/(by-engagement)/nearshore/page.tsx`
- `src/app/startups/(by-engagement)/outsourcing/page.tsx`

---

## Phase 2: Data Layer

### 2.1 Create startup data files

Create `src/data/startups/` directory with data files mirroring the structure of `src/data/industries/`:

- `src/data/startups/by-stage.ts`
- `src/data/startups/by-vertical.ts`
- `src/data/startups/by-product.ts`
- `src/data/startups/by-founder.ts`
- `src/data/startups/by-challenge.ts`
- `src/data/startups/by-engagement.ts`

Each file exports subcategory metadata: label, slug, description, tagline, icon, hero image, SEO fields, FAQ, stats, and service cross-links.

### 2.2 Reuse existing components

The following components from `src/components/industries/` can be reused directly (or wrapped):
- `CategoryPicker.tsx`
- `IndustryChallenges.tsx`
- `IndustryServices.tsx`
- `IndustrySolutions.tsx`
- `IndustryStats.tsx`
- `IndustryFAQ.tsx`
- `IndustryCTA.tsx`
- `IndustryClientReviews.tsx`
- `RelatedCaseStudies.tsx`

Consider renaming or creating aliases if needed (e.g., `StartupChallenges` wrapping `IndustryChallenges`).

---

## Phase 3: Navigation Updates

### 3.1 Update Navbar mega menu (`src/components/Navbar.tsx`)

Replace the `Industries` nav item:

```ts
{
  label: "Startups",
  children: [
    {
      label: "By Stage",
      children: [
        { label: "Pre-Idea Exploration", path: "/startups/pre-idea" },
        { label: "Validation Stage", path: "/startups/validation" },
        { label: "MVP Development", path: "/startups/mvp" },
        { label: "Early Traction", path: "/startups/early-traction" },
        { label: "Seed Stage", path: "/startups/seed-stage" },
        { label: "Series A", path: "/startups/series-a" },
        { label: "Series B & Beyond", path: "/startups/series-b-plus" },
        { label: "Bootstrapped", path: "/startups/bootstrapped" },
        { label: "Growth Stage", path: "/startups/growth" },
        { label: "Scale-Up", path: "/startups/scale-up" },
      ],
    },
    {
      label: "By Vertical",
      children: [
        { label: "Fintech Startups", path: "/startups/fintech" },
        { label: "Healthtech Startups", path: "/startups/healthtech" },
        { label: "Edtech Startups", path: "/startups/edtech" },
        { label: "Proptech Startups", path: "/startups/proptech" },
        { label: "Legaltech Startups", path: "/startups/legaltech" },
        { label: "Agritech Startups", path: "/startups/agritech" },
        { label: "Logistics & Supply Chain", path: "/startups/logistics-tech" },
        { label: "E-commerce & Retail", path: "/startups/ecommerce" },
        { label: "B2B SaaS", path: "/startups/b2b-saas" },
        { label: "Consumer Apps", path: "/startups/consumer-apps" },
      ],
    },
    {
      label: "By Product Type",
      children: [
        { label: "Web Application", path: "/startups/web-app" },
        { label: "Mobile App", path: "/startups/mobile-app" },
        { label: "AI-Powered Product", path: "/startups/ai-product" },
        { label: "SaaS Platform", path: "/startups/saas-platform" },
        { label: "Marketplace", path: "/startups/marketplace" },
        { label: "API Product", path: "/startups/api-product" },
        { label: "Data Platform", path: "/startups/data-platform" },
        { label: "IoT Product", path: "/startups/iot" },
        { label: "Internal Tools", path: "/startups/internal-tools" },
        { label: "Embedded Software", path: "/startups/embedded" },
      ],
    },
    {
      label: "By Founder Type",
      children: [
        { label: "Non-Technical Founder", path: "/startups/non-technical-founder" },
        { label: "First-Time Founder", path: "/startups/first-time-founder" },
        { label: "Solo Founder", path: "/startups/solo-founder" },
        { label: "Repeat Founder", path: "/startups/repeat-founder" },
        { label: "Student Startup", path: "/startups/student-startup" },
        { label: "Corporate Innovator", path: "/startups/corporate-innovator" },
        { label: "Female-Led Startup", path: "/startups/female-led" },
        { label: "African Startup", path: "/startups/african-startup" },
        { label: "Diaspora Founder", path: "/startups/diaspora-founder" },
        { label: "Social Enterprise", path: "/startups/social-enterprise" },
      ],
    },
    {
      label: "By Challenge",
      children: [
        { label: "Need an MVP Fast", path: "/startups/fast-mvp" },
        { label: "Outgrowing Current Tech", path: "/startups/scaling-tech" },
        { label: "Agency Rescue", path: "/startups/agency-rescue" },
        { label: "Preparing for Funding", path: "/startups/fundraising-ready" },
        { label: "Adding AI Features", path: "/startups/ai-integration" },
        { label: "Crushing Tech Debt", path: "/startups/tech-debt" },
        { label: "Security & Compliance", path: "/startups/security-compliance" },
        { label: "Post-Pivot Rebuild", path: "/startups/post-pivot" },
        { label: "No In-House Tech Team", path: "/startups/no-tech-team" },
        { label: "Launching in Africa", path: "/startups/africa-launch" },
      ],
    },
    {
      label: "By Engagement",
      children: [
        { label: "Fixed-Price MVP Build", path: "/startups/fixed-price-mvp" },
        { label: "Dedicated Dev Team", path: "/startups/dedicated-team" },
        { label: "Tech Co-Founder", path: "/startups/tech-cofounder" },
        { label: "CTO as a Service", path: "/startups/cto-as-a-service" },
        { label: "Design Sprint", path: "/startups/design-sprint" },
        { label: "Code & Architecture Audit", path: "/startups/code-audit" },
        { label: "Staff Augmentation", path: "/startups/staff-augmentation" },
        { label: "Ongoing Retainer", path: "/startups/retainer" },
        { label: "Nearshore Partnership", path: "/startups/nearshore" },
        { label: "Outsourced Engineering", path: "/startups/outsourcing" },
      ],
    },
  ],
}
```

### 3.2 Update Footer (`src/components/Footer.tsx`)

Replace the "Industries" column with "Startups" listing the 6 categories:
- By Stage
- By Vertical
- By Product Type
- By Founder Type
- By Challenge
- By Engagement

### 3.3 Update homepage references

In `src/pages-src/Index.tsx`:
- Update the industries section heading, data, and marquee strip to reflect startup language
- Update any `/industries/` links to `/startups/` equivalents

---

## Phase 4: Page Content

### 4.1 Category landing pages (6 pages)

Each category page (e.g., `/startups/by-stage/`) shows:
- Hero with category title and description
- Grid of 10 subcategory cards with hover interaction (reuse `CategoryPicker` pattern)
- CTA section

### 4.2 Subcategory pages (60 pages)

Each subcategory page (e.g., `/startups/mvp/`) uses the same template as existing industry subpages:
- Hero with tailored headline and tagline
- Challenge/pain points section
- Solutions/services offered
- Stats/metrics
- Related case studies
- FAQ
- CTA

Content should be startup-specific and speak directly to the target audience of each subcategory.

---

## Phase 5: SEO & Redirects

### 5.1 Redirect old industry routes

In `next.config.ts`, add redirects from old `/industries/` paths to the most relevant `/startups/` path:

```ts
async redirects() {
  return [
    { source: '/industries/technology-and-startups', destination: '/startups/by-stage', permanent: true },
    { source: '/industries/financial-services', destination: '/startups/fintech', permanent: true },
    // ... map remaining 18 industries to closest startup page
  ];
}
```

### 5.2 Update sitemap

Ensure all 60 new `/startups/` URLs are included in the sitemap and old `/industries/` URLs are excluded or marked as redirected.

### 5.3 OG images

Generate OG images for each of the 6 category pages and 60 subcategory pages.

---

## Phase 6: Cleanup

### 6.1 Remove old industry files

After redirects are confirmed working:
- Remove `src/app/industries/` directory (all category and subcategory pages)
- Remove `src/data/industries/` data files
- Remove unused industry components if any are not shared

### 6.2 Remove old references

- Remove `allIndustries` array from `Index.tsx`
- Remove industry marquee words or replace with startup-relevant terms
- Remove `/industries/` links from any other pages (About, etc.)

---

## Execution Order

| Step | Task | Files Touched | Estimate |
|------|------|---------------|----------|
| 1 | Create data layer (`src/data/startups/`) | 6 new files | Medium |
| 2 | Create category landing pages | 6 new page.tsx files | Small |
| 3 | Create subcategory pages  | 60 new page.tsx files | Large |
| 4 | Update Navbar mega menu | `src/components/Navbar.tsx` | Small |
| 5 | Update Footer | `src/components/Footer.tsx` | Small |
| 6 | Update homepage | `src/pages-src/Index.tsx` | Medium |
| 7 | Add redirects | `next.config.ts` | Small |
| 8 | Generate OG images | `scripts/` or manual | Medium |
| 9 | Test all routes and interactions | - | Medium |
| 10 | Remove old industry files | `src/app/industries/`, `src/data/industries/` | Small |

---

## Notes

- The page template and UI interactions (hover, explore) remain identical - only content and routes change
- Consider keeping `/industries/` routes alive with 301 redirects for 3-6 months to preserve any existing SEO authority
- The existing `CategoryPicker` component's props interface should work without modification if data shape is maintained
- A script can be written to scaffold all 60 subcategory pages from the data files to avoid manual repetition
