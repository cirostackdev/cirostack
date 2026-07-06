# CiroStack Homepage — Redesign Plan (v2)

> **Date**: 2026-04-22
> **Approach**: UI/UX Design + Brand Strategy + CiroStack DNA
> **Core insight**: CiroStack's competitive moat is industry depth (20 verticals, 200 sub-industries) combined with full-lifecycle services (19 services across 5 phases) and a fixed-price model. The homepage must surface all three — not hide them behind navigation.

---

## What's Wrong With the Current Homepage

The current homepage is a generic agency template: hero image with overlay → fake trust logos → 3 service cards → 5 process steps → 3 project cards → testimonial scroll → CTA. You could swap "CiroStack" for any agency name and nothing would change.

**Specific failures:**
1. **No industries visible.** CiroStack has 200 industry pages across 20 verticals — its deepest content investment — and ZERO of them are accessible from the homepage. A healthcare founder lands on the page and sees nothing that says "we understand healthcare."
2. **Only 3 of 19 services shown.** CiroStack offers cloud engineering, DevOps, security audits, data engineering, IAM, embedded software, dedicated teams, nearshore development, digital transformation, and more. The homepage shows: websites, apps, AI. That's a fraction of the value.
3. **The 5-phase lifecycle is invisible.** Ideate → Build → Improve → Operate → Scale is CiroStack's strategic framework. The homepage shows a generic "5 steps to launch" instead.
4. **No pricing story.** Fixed-price is the #1 differentiator. It gets one bullet in the hero subtext. It should be a full section that explains WHY fixed-price matters and HOW it works.
5. **Fake trust logos.** "TechNova", "GrowthLab" — these damage credibility.
6. **Stock photo hero.** Dark overlay on a generic image says "template."
7. **No metrics on featured work.** The projects show descriptions but no hard numbers. Numbers convert.
8. **The hero copy is enterprise jargon.** "Ramps up engineering capacity to accelerate digital transformations" — this is exactly what brand.md says NOT to do.

---

## The Redesigned Homepage — Section by Section

### The Visitor's Journey (what they think at each scroll point)

| Scroll Position | Visitor Thinking | Section That Answers It |
|----------------|-----------------|----------------------|
| 0% (land) | "What is this company?" | Hero |
| ~10% | "Do they work with companies like mine?" | Industries |
| ~25% | "What can they actually do for me?" | Full Service Spectrum |
| ~40% | "Have they done this before? Prove it." | Case Studies with Metrics |
| ~55% | "How does working with them actually work?" | The Fixed-Price Model |
| ~70% | "What do their clients think?" | Testimonials |
| ~85% | "OK, I'm interested. What's next?" | Final CTA |

---

### SECTION 1: HERO — "The First Impression"

**What it communicates**: What CiroStack is + the commercial triple + a reason to scroll.

**Layout**: Clean background (warm cream, no stock photo). Full viewport height. Content centered vertically.

**Content**:
```
[badge] Software Agency for Growing Businesses

[H1] We design, build, and scale
     software for your industry.

[subtext] Fixed price. Senior engineers. Shipped in weeks.
          From websites to AI — across 20+ industries.

[CTA row]
  [Primary pill] Start Your Project →
  [Secondary outline] See Our Work ↓

[stat row - 3 glass pills]
  50+ Projects  |  20+ Industries  |  5 Countries
```

**Why this hero is different:**
- "for your industry" immediately tells the visitor this isn't a generic agency
- "From websites to AI" hints at breadth without listing everything
- "20+ Industries" in the stat row creates curiosity → they'll scroll to find theirs
- No stock photo. Clean, confident, modern. The content does the work.
- The gradient text goes on "software for your industry" — the most important phrase

**Design**:
- Background: `bg-background` (warm cream light, deep navy dark)
- H1: `text-5xl md:text-6xl lg:text-7xl font-display font-bold`
- "software for your industry" gets `text-gradient`
- Stat pills: glass surface with subtle border
- Animation: staggered fade-up on load (Framer Motion, hero only)

---

### SECTION 2: INDUSTRIES — "We Speak Your Language"

**What it communicates**: CiroStack has deep expertise across specific verticals. This isn't a generalist shop.

**Layout**: Section heading + responsive grid of industry cards (4 cols desktop, 2 cols tablet, 1 col mobile). Show 8 featured industries with a "View all 20+ industries" link.

**Content**:
```
[badge] Industries We Serve
[title] Built for your world, not ours.
[description] We don't just write code — we learn your regulations, your users,
              your market dynamics. Then we build software that fits.
```

**8 Featured Industry Cards** (chosen for maximum market coverage):

| Icon | Industry | Tagline | Link |
|------|----------|---------|------|
| HeartPulse | Healthcare & Medical | HIPAA-compliant platforms for better patient outcomes | /industries/healthcare-and-medical |
| Landmark | Financial Services | Secure, real-time systems for modern finance | /industries/financial-services |
| ShoppingCart | Retail & E-Commerce | Conversion-optimized storefronts and marketplaces | /industries/retail-and-e-commerce |
| GraduationCap | Education & E-Learning | Scalable LMS platforms for 50K+ concurrent learners | /industries/education-and-e-learning |
| Factory | Manufacturing | IoT dashboards and predictive maintenance systems | /industries/manufacturing-and-industrial |
| Laptop | Technology & Startups | From MVP to scale — engineering velocity for founders | /industries/technology-and-startups |
| Building2 | Real Estate | PropTech platforms for listings, tours, and transactions | /industries/real-estate-and-property |
| Truck | Logistics | Real-time tracking and supply chain intelligence | /industries/transportation-and-logistics |

**Each card**:
- Icon (24px, primary color) + Industry name (font-display, semibold) + One-line tagline (muted)
- Hover: lift + border shifts to primary/30%
- Entire card is a link to the industry page
- Clean, compact — no images, just content density

**Below the grid**:
```
We also serve: Legal · Government · Agriculture · Construction · Media · Hospitality · Sports · Beauty · Automotive · Non-Profit · Professional Services · Small Business
[link] Explore all industries →
```

**Design**: 
- Background: `section-alt` for visual break
- Cards: `surface-glass hover-lift` with icon + text
- The "also serve" line uses muted text with primary-colored links
- CSS transitions only (no Framer Motion — this is below the fold)

---

### SECTION 3: SERVICES — "The Full Stack"

**What it communicates**: CiroStack covers the ENTIRE software lifecycle — not just development. They can take you from idea to scale.

**Layout**: Section heading + the 5-phase lifecycle as a horizontal rail (desktop) / vertical timeline (mobile), with services grouped under each phase.

**Content**:
```
[badge] What We Do
[title] From first idea to global scale.
[description] 19 services across 5 phases of the software lifecycle.
              Whatever stage you're at, we meet you there.
```

**The 5-Phase Lifecycle**:

| Phase | Color | Services Under It |
|-------|-------|-------------------|
| **Ideate** | gradient-start (red) | AI Consultation · Startup Strategy · Digital Transformation |
| **Build** | blend | Websites · Mobile Apps · UX/UI Design |
| **Improve** | mid-gradient | Cloud Consulting · Cloud Engineering |
| **Operate** | blend | Data Engineering · IAM · Security Audits |
| **Scale** | gradient-end (purple) | Dedicated Teams · Nearshore Dev · Automation Testing · Software Auditing |

**Visual treatment**:
- 5 columns on desktop, each with a phase name at top (large, bold, font-display)
- A horizontal gradient bar connects all 5 phases (red → purple)
- Under each phase name, services listed as clean text links
- The active/hovered phase expands slightly, services become more prominent
- Each service name links to its service page

**Below**: `Starting from $2,500 · Fixed-price packages for every service.` → [View pricing](/pricing)

**Design**:
- Background: `bg-background`
- Phase headers: large (text-2xl), font-display, each gets a subtle color from the gradient spectrum
- Service links: text-sm, muted, hover:text-primary
- The gradient rail is a thin bar (h-1) with `bg-gradient-to-r from-primary to-accent`
- Mobile: becomes vertical timeline with phase names as section headers

---

### SECTION 4: FEATURED WORK — "The Proof"

**What it communicates**: CiroStack delivers real results with measurable impact.

**Layout**: Section heading + 3 large project cards, each with an image, metrics, and industry tag.

**Content**:
```
[badge] Our Work
[title] Results that speak for themselves.
```

**3 Project Cards**:

| Project | Image | Industry | Key Metric | Tags |
|---------|-------|----------|------------|------|
| HealthFlow Dashboard | portfolio-healthflow.jpg | Healthcare | 60% less admin time | Web App · AI |
| ShopLocal Marketplace | portfolio-shoplocal.jpg | Retail | ₦60M in 90-day GMV | E-commerce · Marketplace |
| AutoTask AI | portfolio-autotask.jpg | Enterprise | 75% less manual work | AI · Automation |

**Each card**:
- Large image (aspect-video, zoom on hover)
- Industry badge (top-right of image, small pill, bg-black/60 text-white)
- Below image: Project title (font-display, semibold) + client name (muted, small)
- **Key metric in a trust-colored badge**: e.g., `↑ 60% less admin time` (bg-trust/10, text-trust)
- Tag pills for technology/category
- Links to /portfolio

**Below cards**: `View all 25 projects →` link

**Design**:
- Background: `section-alt`
- Cards: rounded-2xl, overflow-hidden, surface-glass
- Metric badge is the standout element — green (trust color) to pop against the warm palette
- CSS transitions for hover (no Framer Motion)

---

### SECTION 5: WHY FIXED PRICE — "The Differentiator"

**What it communicates**: CiroStack's pricing model is fundamentally different and better for the client.

**Layout**: Two columns. Left: bold narrative. Right: the 4 pillars + how payment works.

**Left column**:
```
[badge] Why CiroStack
[title] No hourly billing.
        No surprises.
        No excuses.

[body paragraph]
Most agencies bill by the hour — which means the longer your project takes,
the more they earn. We flipped that. You get a fixed price before we write
a single line of code. If we go over, that's on us. Not you.
```

**Right column — 4 value cards** (compact, 2x2 grid):

| Icon | Title | One-liner |
|------|-------|-----------|
| DollarSign | **Fixed Price** | The quote is the price. Period. |
| Users | **Senior Engineers** | The team you meet builds your product. No handoffs to juniors. |
| Zap | **Weeks, Not Months** | Most projects ship in 4-8 weeks. We move fast without cutting corners. |
| Shield | **You Own Everything** | Code, designs, IP — all yours from day one. No lock-in. |

**Below the 2x2 grid** — payment structure:
```
How payment works: 30% upfront → 30% on design approval → 30% on dev complete → 10% on launch
```

**Design**:
- Background: `bg-background`
- Left column title: `text-3xl md:text-4xl lg:text-5xl font-display font-bold`
- "No surprises." line could use `text-gradient` for emphasis
- Value cards: subtle border, icon in primary/10% circle, compact text
- Payment flow shown as a simple horizontal stepper with 4 dots connected by a line

---

### SECTION 6: TESTIMONIALS

**What it communicates**: Other people trust CiroStack.

**Layout**: Existing `TestimonialsMarquee` component — it's well-built, keep it.

**Content**: Use `allTestimonials` data.

**Heading**: `What our partners say`
**Subheading**: `Trusted by founders, CTOs, and engineering teams worldwide.`

---

### SECTION 7: FINAL CTA — "The Close"

**What it communicates**: One clear next step.

**Layout**: Centered, generous padding, section-alt background.

**Content**:
```
[title] Let's build something that matters.
        ("matters" in gradient text)

[body] Tell us about your project. 
       We respond within 24 hours with a free, no-obligation quote.

[Primary CTA pill] Get a Free Quote →
[secondary text] or email contact@cirostack.com
```

---

## What's NOT on the Homepage (and why)

| Omitted | Reason |
|---------|--------|
| Fake trust logos | Credibility risk. Replaced with real tech strip inside industries section |
| Stock photo hero | Template feel. Clean background signals confidence |
| Three.js globe/particles | 500KB+ for decoration. Zero information value |
| Blog posts | Not a conversion driver for first visit. In nav for return visits |
| Team photos | About page. Homepage sells the capability, not the faces |
| All 200 industry pages | 8 featured + "also serve" list + "explore all" link covers it |
| Video | No real founder video exists yet. Add when it does |
| Pricing tiers | Own page. Homepage mentions fixed-price as differentiator without the spreadsheet |

---

## Technical Notes

- **Framer Motion**: Hero only (staggered fade-up on load). Everything else uses CSS transitions.
- **No new components needed**: Uses existing `SectionHeading`, `TestimonialsMarquee`, `Button`, `Badge`, and standard Tailwind patterns.
- **New patterns introduced**: 
  - 5-phase lifecycle rail (CSS gradient bar + grid)
  - Industry card grid
  - Metric badge (trust-colored)
  - Payment stepper (CSS dots + line)
- **Dark mode**: All sections use semantic tokens. No raw hex values.
- **Performance**: Zero Three.js. Zero GSAP. ~1 Framer Motion instance (hero). Rest is CSS.
- **Accessibility**: All cards are links with proper labels. All icons have aria-hidden. Stat pills are semantic text.

---

## Implementation Order

1. Rewrite `src/pages-src/Index.tsx` from scratch
2. All 7 sections in a single file (no unnecessary component extraction)
3. Test light + dark mode
4. Test responsive (mobile → desktop)
5. Verify all links work
