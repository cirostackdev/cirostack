<div align="center">

# CiroStack

**Full-stack software agency platform: marketing site, client portal, admin ops, CMS, and news aggregation — all in one Next.js monorepo.**

[![Next.js](https://img.shields.io/badge/Next.js_15-0d1117?style=flat-square&logo=nextdotjs&logoColor=58a6ff)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-0d1117?style=flat-square&logo=typescript&logoColor=58a6ff)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-0d1117?style=flat-square&logo=postgresql&logoColor=58a6ff)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-0d1117?style=flat-square&logo=prisma&logoColor=58a6ff)](https://prisma.io)
[![Neon](https://img.shields.io/badge/Neon-0d1117?style=flat-square&logo=neon&logoColor=58a6ff)](https://neon.tech)
[![Pusher](https://img.shields.io/badge/Pusher-0d1117?style=flat-square&logo=pusher&logoColor=58a6ff)](https://pusher.com)
[![Paystack](https://img.shields.io/badge/Paystack-0d1117?style=flat-square&logo=stripe&logoColor=58a6ff)](https://paystack.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0d1117?style=flat-square&logo=tailwindcss&logoColor=58a6ff)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Vercel-0d1117?style=flat-square&logo=vercel&logoColor=58a6ff)](https://vercel.com)

</div>

---

## Overview

CiroStack is a software development agency platform for SMBs and startup founders in Africa and the diaspora. It ships as a single Next.js 15 monorepo covering the full business surface:

- A **marketing website** with 238 pages, 200 SEO industry pages, and 40 startup-segment landing pages
- An **admin panel** for managing leads, projects, invoices, clients, and a real-time live chat inbox
- A **client portal** where clients track projects, pay invoices via Paystack, and message the team
- A **CMS** for blog posts, portfolio, jobs, events, resources, and news aggregation
- A **`cirolabs/`** sub-app: standalone landing and waitlist page for CiroLabs, a mobile dev-education product

---

## Architecture

**Single Next.js monorepo over a separate backend API**
All business logic runs inside Next.js API routes. There is no Express backend. This eliminates network hops between frontend and backend during SSR, keeps deployment to a single Vercel project, and means shared TypeScript types across every layer without a separate package.

**Two isolated auth systems sharing one codebase**
Admin auth uses NextAuth v5 with a Credentials provider, bcrypt password hashing, and JWT sessions scoped to `/admin`. Client portal auth uses a separate NextAuth instance at `/api/auth-client/[...nextauth]` with OTP-based email login via Resend. The two systems cannot cross-authenticate — a client token gives no access to admin routes and vice versa.

**Pusher Channels for real-time chat, not Socket.io**
The live chat inbox uses Pusher Channels rather than a custom WebSocket server. This avoids managing a persistent Node.js process on Vercel's serverless infrastructure. Socket.io was evaluated and removed: it requires a stateful server, which conflicts with Vercel's execution model.

**Paystack webhooks with signature verification**
Invoice payments go through Paystack. The webhook handler verifies the `x-paystack-signature` HMAC-SHA512 header before processing any event. No payment state is mutated without a verified webhook — the client-side success callback is UI-only.

**News aggregation via dual-channel sync**
The newsroom pulls from two sources: the Guardian API (JSON) and TechCrunch via RSS with full-article scraping. Sync runs every 3 hours via GitHub Actions and daily via a Vercel cron job. Articles are deduplicated at the URL level, with a `NewsArticleBlocklist` table for manual exclusions and a `NewsArticleScrapeAttempt` table for retry tracking.

**Feature flags via env vars, not a feature-flag service**
Sections that require real data to be credible (testimonials, case studies, team, announcements) are hidden until populated via `NEXT_PUBLIC_HIDE_*` environment variables. This is a deliberate release strategy: the site is deployed without placeholder content, and sections go live incrementally as content is produced.

**35 Prisma models, one schema file**
The entire data model lives in a single `schema.prisma`: chat, CMS, client portal, invoicing, leads, knowledge base, push subscriptions, and news. Separation into multiple databases was considered and rejected — the query patterns are relational and cross-domain queries (e.g., a conversation linked to a client linked to a project) are cleaner in a single schema.

---

## What's Inside

### Marketing Site (238 pages)

The public-facing agency site is organized by how prospects arrive:

| Section | Pages | Purpose |
|---|---|---|
| Home, About, Services | Core | Brand and offer overview |
| Industries | 200 | SEO pages per industry vertical |
| Startups | 40 | Segmented by challenge, founder type, product, stage, and vertical |
| Portfolio | 25 entries | Case studies (visible when `NEXT_PUBLIC_HIDE_CASE_STUDIES` is unset) |
| Blog | 16+ posts | Thought leadership |
| Newsroom | Dynamic | Press aggregation from Guardian + TechCrunch |

Services are organized across five delivery phases: Ideate, Build, Improve, Operate, and Scale — covering cloud consulting, UX/UI design, frontend/backend development, AI integration, DevOps, CTO-as-a-Service, and nearshore staffing.

---

### Admin Panel (`/admin`)

Full internal ops tool protected by NextAuth credentials auth.

| Module | Capabilities |
|---|---|
| Dashboard | KPIs, recent activity, quick actions |
| Conversations | Real-time inbox (Pusher), split panel, tags, internal notes, bulk actions, canned responses, CSAT |
| CMS | CRUD for blog, portfolio, jobs, events, resources, announcements, news |
| Clients | Profiles linked to projects, invoices, and conversations |
| Projects | Milestones, updates, files, comments, full lifecycle |
| Invoices | Create, send, track, dispute, export CSV |
| Leads | Pipeline with status cycling, tags, CSV export, convert-to-client |
| Analytics | Pipeline, financial, SLA, CSAT, and agent performance metrics |
| Knowledge Base | Help articles published to the client portal |
| Automation | Keyword triggers, offline auto-replies, no-response timeouts |
| Settings | Team management, SLA config, business hours, widget config, conversation tags |

---

### Client Portal (`/portal`)

Separate auth system for agency clients. OTP login via email (Resend), rate-limited.

| Module | Capabilities |
|---|---|
| Dashboard | Project progress summary, invoice alerts, recent activity |
| Projects | View progress, approve milestones, post comments |
| Invoices | View, pay via Paystack, download PDF, dispute |
| Files | Download project deliverables |
| Messages | Real-time chat with the agency team (Pusher) |
| Help Center | Searchable knowledge base sourced from admin panel |
| Analytics | Monthly spend, project status breakdown |
| Settings | Profile, password, notification preferences, team member invites |

Clients can invite team members with `viewer` or `admin` portal roles.

---

### CiroLabs (`cirolabs/`)

A standalone Next.js sub-app (separate `package.json`, separate Prisma schema) for **CiroLabs**: a mobile product that teaches real development skills with AI-powered workflows.

The landing page shows four product screens:

- **SplitView**: AI-assisted vs manual coding side by side
- **PromptLab**: Instructor prompts users can copy and save
- **Cipher**: In-app AI tutor aware of lesson progress
- **ShipIt**: Capstone project with a direct CiroStack talent pipeline entry

The waitlist form collects name and email, stores in a `Lead` table, and sends a confirmation via Resend.

---

## Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Core**

![Next.js 15](https://img.shields.io/badge/Next.js_15_App_Router-0d1117?style=flat-square&logo=nextdotjs&logoColor=58a6ff)
![React 19](https://img.shields.io/badge/React_19-0d1117?style=flat-square&logo=react&logoColor=58a6ff)
![TypeScript](https://img.shields.io/badge/TypeScript_5.9-0d1117?style=flat-square&logo=typescript&logoColor=58a6ff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0d1117?style=flat-square&logo=tailwindcss&logoColor=58a6ff)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-0d1117?style=flat-square&logo=shadcnui&logoColor=58a6ff)

**Database**

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-0d1117?style=flat-square&logo=postgresql&logoColor=58a6ff)
![Prisma](https://img.shields.io/badge/Prisma_7.8-0d1117?style=flat-square&logo=prisma&logoColor=58a6ff)
![Neon](https://img.shields.io/badge/Neon_Serverless-0d1117?style=flat-square&logo=neon&logoColor=58a6ff)

**Auth**

![NextAuth v5](https://img.shields.io/badge/NextAuth_v5-0d1117?style=flat-square&logo=nextdotjs&logoColor=58a6ff)
![bcryptjs](https://img.shields.io/badge/bcryptjs-0d1117?style=flat-square&logo=letsencrypt&logoColor=58a6ff)

**Realtime**

![Pusher](https://img.shields.io/badge/Pusher_Channels-0d1117?style=flat-square&logo=pusher&logoColor=58a6ff)

</td>
<td valign="top" width="50%">

**Payments + Email**

![Paystack](https://img.shields.io/badge/Paystack-0d1117?style=flat-square&logo=stripe&logoColor=58a6ff)
![Resend](https://img.shields.io/badge/Resend-0d1117?style=flat-square&logo=maildotru&logoColor=58a6ff)

**Storage + Push**

![Vercel Blob](https://img.shields.io/badge/Vercel_Blob-0d1117?style=flat-square&logo=vercel&logoColor=58a6ff)
![Web Push](https://img.shields.io/badge/Web_Push_(VAPID)-0d1117?style=flat-square&logo=googlechrome&logoColor=58a6ff)

**UI + Animations**

![Framer Motion](https://img.shields.io/badge/Framer_Motion_12-0d1117?style=flat-square&logo=framer&logoColor=58a6ff)
![GSAP](https://img.shields.io/badge/GSAP_3.14-0d1117?style=flat-square&logo=greensock&logoColor=58a6ff)
![Three.js](https://img.shields.io/badge/Three.js-0d1117?style=flat-square&logo=threedotjs&logoColor=58a6ff)
![Recharts](https://img.shields.io/badge/Recharts-0d1117?style=flat-square&logo=chartdotjs&logoColor=58a6ff)

**Analytics**

![Meta CAPI](https://img.shields.io/badge/Meta_CAPI-0d1117?style=flat-square&logo=meta&logoColor=58a6ff)

**Testing**

![Vitest](https://img.shields.io/badge/Vitest-0d1117?style=flat-square&logo=vitest&logoColor=58a6ff)

</td>
</tr>
</table>

---

## Project Structure

```
cirostack/
├── src/
│   ├── app/                        # 238 Next.js App Router pages
│   │   ├── (public)/               # Home, About, Services, Industries, Blog
│   │   ├── startups/               # 40 SEO segments (by-challenge, by-stage, etc.)
│   │   ├── newsroom/               # DB-backed press and news pages
│   │   ├── admin/                  # Internal ops panel (NextAuth credentials)
│   │   │   ├── conversations/      # Live chat inbox (Pusher)
│   │   │   ├── cms/                # Blog, portfolio, jobs, events, resources, news
│   │   │   ├── clients/            # Client profiles
│   │   │   ├── projects/           # Project lifecycle management
│   │   │   ├── invoices/           # Invoice management
│   │   │   ├── leads/              # Lead pipeline
│   │   │   ├── analytics/          # KPIs and metrics
│   │   │   ├── automation/         # Keyword triggers and auto-replies
│   │   │   ├── knowledge-base/     # Help articles for portal
│   │   │   └── settings/           # Team, SLA, business hours, widget config
│   │   ├── portal/                 # Client self-service portal (OTP auth)
│   │   │   ├── dashboard/, projects/, invoices/, files/
│   │   │   ├── chat/, help/, analytics/, settings/
│   │   │   └── @modal/             # Parallel route: invoice checkout modal
│   │   └── api/                    # ~120 API route handlers
│   ├── components/                 # 92 UI components (Navbar, HeroGlobe, Chat widget)
│   ├── data/                       # Static: 200 industry entries, 25 case studies
│   ├── lib/                        # prisma, pusher, paystack, resend, news-sync, push
│   ├── pages-src/                  # 23 client-side page components
│   └── styles/globals.css          # Tailwind + HSL design tokens
│
├── cirolabs/                       # Standalone CiroLabs waitlist site
│   ├── src/app/                    # Landing page + /api/waitlist
│   └── prisma/                     # Separate schema (Lead model only)
│
├── prisma/                         # Main app schema (35 models)
│   ├── schema.prisma
│   ├── seed.ts                     # Admin user seed
│   ├── seed-cms.ts                 # Blog, portfolio, careers content
│   ├── seed-portal.ts              # Client portal demo data
│   └── seed-settings.ts            # SLA, business hours, widget defaults
│
├── middleware.ts                   # Rate limiting on /api/contact/* (5 req/min)
├── vercel.json                     # Cron: /api/news/sync daily at midnight
└── .github/workflows/news-sync.yml # News sync every 3 hours
```

---

## Data Model (35 Models)

```
Chat/Conversations
  Admin · Conversation · Message · CannedResponse · ConversationTag
  InternalNote · CSATRating · WidgetConfig · BusinessHours
  AutomationRule · AssignmentRule · SLAConfig

CMS
  BlogPost · Job · PortfolioProject · Event · Resource
  Announcement · NewsArticle · NewsArticleBlocklist · NewsArticleScrapeAttempt

Agency Ops
  FormSubmission · Lead

Client Portal
  Client · Project · Milestone · ProjectUpdate · ProjectFile
  ProjectComment · Invoice · InvoiceDispute · ClientTeamMember
  Notification · NotificationPreference · KnowledgeArticle · PushSubscription
```

---

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- [Neon](https://neon.tech) PostgreSQL database
- [Pusher](https://pusher.com) app (Channels)
- [Paystack](https://paystack.com) account
- [Resend](https://resend.com) account
- [Vercel Blob](https://vercel.com/storage/blob) store

### 1. Clone

```bash
git clone https://github.com/cirostackdev/cirostack.git
cd cirostack
```

### 2. Install

```bash
bun install
# or npm install
```

### 3. Environment

```bash
cp .env.example .env.local
```

Fill in (see full list below).

### 4. Database

```bash
npx prisma db push
npx prisma generate

# Optional: seed with demo content
npx prisma db seed
```

### 5. Run

```bash
bun dev       # → http://localhost:3000
```

For CiroLabs:

```bash
cd cirolabs && bun install && bun dev   # → http://localhost:3001
```

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/cirostack?sslmode=require"

# NextAuth (admin)
NEXTAUTH_SECRET="your-admin-secret"
NEXTAUTH_URL="http://localhost:3000"

# NextAuth (client portal)
CLIENT_NEXTAUTH_SECRET="your-client-secret"

# Pusher
PUSHER_APP_ID="your-app-id"
PUSHER_KEY="your-key"
PUSHER_SECRET="your-secret"
NEXT_PUBLIC_PUSHER_KEY="your-key"
NEXT_PUBLIC_PUSHER_CLUSTER="eu"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# Paystack
PAYSTACK_SECRET_KEY="sk_..."
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_..."

# Web Push (VAPID)
VAPID_PUBLIC_KEY="your-public-vapid-key"
VAPID_PRIVATE_KEY="your-private-vapid-key"

# Email
RESEND_API_KEY="re_..."

# News sync auth
CRON_SECRET="your-cron-secret"

# Site URL
SITE_URL="https://cirostack.com"

# Feature flags (optional — hides sections until content is ready)
NEXT_PUBLIC_HIDE_TESTIMONIALS=true
NEXT_PUBLIC_HIDE_CASE_STUDIES=true
NEXT_PUBLIC_HIDE_ANNOUNCEMENTS=true
NEXT_PUBLIC_HIDE_TEAM=true
```

---

## Feature Flags

| Flag | Effect |
|---|---|
| `NEXT_PUBLIC_HIDE_TESTIMONIALS` | Hides testimonial sections sitewide |
| `NEXT_PUBLIC_HIDE_CASE_STUDIES` | Hides portfolio sections and redirects `/portfolio` to home |
| `NEXT_PUBLIC_HIDE_ANNOUNCEMENTS` | Hides company announcements in the newsroom |
| `NEXT_PUBLIC_HIDE_TEAM` | Hides the Team section on the About page |

Set any of these to `true` to suppress the section until real content is available.

---

## Scripts

```bash
# Development
bun dev              # Start dev server on :3000
bun build            # Production build
bun start            # Serve production build
bun lint             # ESLint

# Database
npx prisma db push           # Push schema to database
npx prisma generate          # Regenerate Prisma client
npx prisma studio            # Database GUI
npx prisma db seed           # Run all seed files

# News sync (manual trigger)
curl -H "Authorization: Bearer $CRON_SECRET" https://your-domain.com/api/news/sync?source=guardian
curl -H "Authorization: Bearer $CRON_SECRET" https://your-domain.com/api/news/sync?source=techcrunch
```

---

<div align="center">

Built by [Jessy Chidera Onah](https://github.com/cirostackdev) · Founder @ [CiroStack](https://cirostack.com)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/jessyonah)
[![Email](https://img.shields.io/badge/Email-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:jessychideraonah@gmail.com)

</div>
