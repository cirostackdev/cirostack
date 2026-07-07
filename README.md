<div align="center">

# CiroStack

**Full-stack software agency platform: marketing site, client portal, admin ops, CMS, and news aggregation — all in one Next.js monorepo.**

[![Next.js](https://img.shields.io/badge/Next.js_15-0d1117?style=flat-square&logo=nextdotjs&logoColor=58a6ff)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript_5.9-0d1117?style=flat-square&logo=typescript&logoColor=58a6ff)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-0d1117?style=flat-square&logo=postgresql&logoColor=58a6ff)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma_7.8-0d1117?style=flat-square&logo=prisma&logoColor=58a6ff)](https://prisma.io)
[![Neon](https://img.shields.io/badge/Neon-0d1117?style=flat-square&logo=neon&logoColor=58a6ff)](https://neon.tech)
[![Pusher](https://img.shields.io/badge/Pusher-0d1117?style=flat-square&logo=pusher&logoColor=58a6ff)](https://pusher.com)
[![Paystack](https://img.shields.io/badge/Paystack-0d1117?style=flat-square&logo=stripe&logoColor=58a6ff)](https://paystack.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0d1117?style=flat-square&logo=tailwindcss&logoColor=58a6ff)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Vercel-0d1117?style=flat-square&logo=vercel&logoColor=58a6ff)](https://vercel.com)

</div>

---

## Overview

CiroStack is a software development agency platform for SMBs and startup founders in Africa and the diaspora. It ships as a single Next.js 15 monorepo covering the full business surface: a marketing website with 200+ SEO pages, an admin panel for managing leads, projects, invoices, and real-time chat, a client portal where clients track projects and pay invoices via Paystack, a CMS for all content, and a news aggregation newsroom.

---

## Architecture

**Single Next.js monorepo, no separate Express backend**
All business logic runs inside Next.js API routes. This eliminates network hops during SSR, keeps deployment to a single Vercel project, and means shared TypeScript types across every layer without a separate package.

**Two isolated NextAuth v5 instances**
Admin auth uses a Credentials provider with bcrypt password hashing and JWT sessions scoped to `/admin`. Client portal auth uses a separate NextAuth instance with OTP-based email login via Resend. The two systems cannot cross-authenticate — a client token gives no access to admin routes.

**Pusher Channels for real-time chat, not Socket.io**
The live chat inbox uses Pusher Channels to avoid managing a persistent Node.js process on Vercel's serverless infrastructure. Socket.io was evaluated and removed: it requires a stateful server, which conflicts with Vercel's execution model.

**Paystack webhooks with HMAC-SHA512 verification**
Invoice payments go through Paystack. The webhook handler verifies the `x-paystack-signature` header before processing any event. No payment state is mutated without a verified webhook — the client-side callback is UI-only.

**News aggregation via dual-channel sync**
The newsroom pulls from the Guardian API and RSS feeds via `@extractus/article-extractor`. Sync runs daily via a Vercel cron job. Articles are deduplicated at the URL level with `NewsArticleBlocklist` for manual exclusions and `NewsArticleScrapeAttempt` for retry tracking.

**Rate limiting in middleware, not in routes**
`middleware.ts` enforces 5 req/min per IP on `/api/contact/*` using an in-memory map. This runs at the edge before any route handler executes.

**36 Prisma models, one schema file**
The entire data model lives in a single `schema.prisma`. Cross-domain queries (a conversation linked to a client linked to a project) are cleaner in one schema than across multiple databases.

---

## Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**

![Next.js 15](https://img.shields.io/badge/Next.js_15_App_Router-0d1117?style=flat-square&logo=nextdotjs&logoColor=58a6ff)
![React 18](https://img.shields.io/badge/React_18-0d1117?style=flat-square&logo=react&logoColor=58a6ff)
![TypeScript](https://img.shields.io/badge/TypeScript_5.9-0d1117?style=flat-square&logo=typescript&logoColor=58a6ff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0d1117?style=flat-square&logo=tailwindcss&logoColor=58a6ff)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-0d1117?style=flat-square&logo=shadcnui&logoColor=58a6ff)
![Framer Motion](https://img.shields.io/badge/Framer_Motion_12-0d1117?style=flat-square&logo=framer&logoColor=58a6ff)
![GSAP](https://img.shields.io/badge/GSAP_3.14-0d1117?style=flat-square&logo=greensock&logoColor=58a6ff)
![Three.js](https://img.shields.io/badge/Three.js_+_R3F-0d1117?style=flat-square&logo=threedotjs&logoColor=58a6ff)
![Recharts](https://img.shields.io/badge/Recharts-0d1117?style=flat-square&logo=chartdotjs&logoColor=58a6ff)

**Backend**

![Node.js](https://img.shields.io/badge/Node.js-0d1117?style=flat-square&logo=nodedotjs&logoColor=58a6ff)
![Pusher](https://img.shields.io/badge/Pusher_Channels-0d1117?style=flat-square&logo=pusher&logoColor=58a6ff)
![Resend](https://img.shields.io/badge/Resend-0d1117?style=flat-square&logo=maildotru&logoColor=58a6ff)
![Vercel Blob](https://img.shields.io/badge/Vercel_Blob-0d1117?style=flat-square&logo=vercel&logoColor=58a6ff)
![Web Push](https://img.shields.io/badge/Web_Push_(VAPID)-0d1117?style=flat-square&logo=googlechrome&logoColor=58a6ff)

</td>
<td valign="top" width="50%">

**Database**

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-0d1117?style=flat-square&logo=postgresql&logoColor=58a6ff)
![Prisma](https://img.shields.io/badge/Prisma_7.8-0d1117?style=flat-square&logo=prisma&logoColor=58a6ff)
![Neon](https://img.shields.io/badge/Neon_Serverless-0d1117?style=flat-square&logo=neon&logoColor=58a6ff)

**Security**

![NextAuth v5](https://img.shields.io/badge/NextAuth_v5-0d1117?style=flat-square&logo=nextdotjs&logoColor=58a6ff)
![bcryptjs](https://img.shields.io/badge/bcryptjs-0d1117?style=flat-square&logo=letsencrypt&logoColor=58a6ff)

**Payment**

![Paystack](https://img.shields.io/badge/Paystack-0d1117?style=flat-square&logo=stripe&logoColor=58a6ff)

</td>
</tr>
</table>

---

## What's Inside

### Marketing Site

| Section | Purpose |
|---|---|
| Home, About, Services | Brand and offer overview |
| Industries | SEO pages per industry vertical |
| Startups | Segmented by challenge, founder type, stage, and vertical |
| Portfolio | Case studies |
| Blog | Thought leadership |
| Newsroom | Press aggregation (Guardian + RSS) |
| Events, Resources, Careers | Content and hiring |

---

### Admin Panel (`/admin`)

| Module | Capabilities |
|---|---|
| Dashboard | KPIs, recent activity, quick actions |
| Conversations | Real-time inbox (Pusher), split panel, tags, internal notes, canned responses, CSAT, bulk actions |
| Submissions | Form submissions with status tracking, CSV export |
| Leads | Pipeline with status cycling, tags, CSV export, convert-to-client |
| CMS | CRUD for blog, portfolio, jobs, events, resources, announcements |
| Clients | Profiles linked to projects, invoices, and conversations |
| Projects | Milestones, updates, files, comments, full lifecycle |
| Invoices | Create, send, track, export CSV |
| Revenue | Monthly charts, payment history, CSV export |
| Analytics | Pipeline, financial, SLA, CSAT, and agent performance |
| Knowledge Base | Help articles published to the client portal |
| Automation | Keyword triggers, offline auto-replies, no-response timeouts |
| Settings | Team management, SLA config, business hours, widget config, conversation tags |

---

### Client Portal (`/portal`)

| Module | Capabilities |
|---|---|
| Dashboard | Project progress, invoice alerts, recent activity |
| Projects | View progress, approve milestones, post comments |
| Invoices | View, pay via Paystack, download PDF, dispute |
| Files | Download project deliverables |
| Chat | Real-time messaging with the agency team (Pusher) |
| Help Center | Searchable knowledge base sourced from admin panel |
| Analytics | Monthly spend, project status breakdown |
| Settings | Profile, password, notification preferences, team member invites |

---

### CiroLabs (`cirolabs/`)

Standalone Next.js sub-app with its own `package.json` and Prisma schema. Landing page for CiroLabs — a mobile product that teaches real development skills with AI-powered workflows. The waitlist form stores leads and sends a confirmation via Resend.

---

## Project Structure

```mermaid
graph LR
    root["cirostack"]

    root --> src["src"]
    root --> cirolabs["cirolabs\nCiroLabs sub-app"]
    root --> prisma_d["prisma\n36-model schema + seeds"]

    src --> app["app"]
    src --> components["components"]
    src --> lib["lib"]

    app --> public_r["(public)\nmarketing pages"]
    app --> startups["startups\nSEO segments"]
    app --> newsroom["newsroom\nDB-backed press"]
    app --> admin["admin"]
    app --> portal["portal"]
    app --> api["api\n~120 route handlers"]

    admin --> conv["conversations\nlive chat inbox"]
    admin --> cms["cms\nblog, portfolio, jobs, events"]
    admin --> clients["clients\nclient profiles"]
    admin --> proj_a["projects\nfull lifecycle"]
    admin --> inv_a["invoices\ncreate, send, track"]
    admin --> leads["leads\npipeline management"]
    admin --> analytics_a["analytics\nKPIs and metrics"]
    admin --> settings_a["settings\nteam, SLA, widget"]

    portal --> dash["dashboard\noverview + alerts"]
    portal --> proj_p["projects\nmilestones, comments"]
    portal --> inv_p["invoices\npay via Paystack"]
    portal --> chat["chat\nreal-time messaging"]
    portal --> files["files\ndeliverables"]
    portal --> settings_p["settings\nprofile, team, notifs"]
```

---

## Data Model

### Chat / Conversations

```mermaid
erDiagram
    Admin {
        string id PK
        string email
        string name
        string role "agent | admin"
        bool online
        bool disabled
    }
    Conversation {
        string id PK
        string visitorId
        string visitorName
        string topic
        string status "open | closed"
        string priority "normal | high | urgent"
        string assignedToId FK
    }
    Message {
        string id PK
        string conversationId FK
        string senderType
        string body
        string fileUrl
        bool read
        json reactions
    }
    CannedResponse {
        string id PK
        string adminId FK
        string title
        string shortcut
        string content
        string category
    }
    ConversationTag {
        string id PK
        string name
        string color
    }
    InternalNote {
        string id PK
        string conversationId FK
        string adminId FK
        string body
    }
    CSATRating {
        string id PK
        string conversationId FK
        int rating "1-5"
        string feedback
    }
    SLAConfig {
        string id PK
        int maxFirstResponseMins
        int maxResolutionMins
        bool breachNotify
    }
    BusinessHours {
        string id PK
        int day "0=Sun 6=Sat"
        string startTime
        string endTime
        bool enabled
    }
    WidgetConfig {
        string id PK
        string primaryColor
        string position
        string welcomeMessage
        bool preChatForm
    }
    AssignmentRule {
        string id PK
        string name
        string type "round-robin | topic-based | load-balance"
        bool enabled
    }
    AutomationRule {
        string id PK
        string name
        string trigger "new-conversation | offline | keyword | no-response"
        string action "send-message | assign | tag | close"
        bool enabled
    }

    Admin ||--o{ Conversation        : "assigned to"
    Admin ||--o{ CannedResponse      : "owns"
    Admin ||--o{ InternalNote        : "writes"
    Conversation ||--o{ Message      : "contains"
    Conversation ||--o{ InternalNote : "has"
    Conversation }o--o{ ConversationTag : "tagged with"
    Conversation ||--o| CSATRating   : "rated via"
```

### Client Portal

```mermaid
erDiagram
    Client {
        string id PK
        string email
        string name
        string company
        string otpCode
        datetime otpExpiry
    }
    ClientTeamMember {
        string id PK
        string clientId FK
        string email
        string role "viewer | admin"
    }
    Project {
        string id PK
        string clientId FK
        string title
        string status "discovery | active | review | complete"
    }
    Milestone {
        string id PK
        string projectId FK
        string title
        bool completed
        int order
    }
    ProjectUpdate {
        string id PK
        string projectId FK
        string body
        bool internal
    }
    ProjectFile {
        string id PK
        string projectId FK
        string name
        string url
    }
    ProjectComment {
        string id PK
        string projectId FK
        string clientId FK
        string body
    }
    Invoice {
        string id PK
        string clientId FK
        string projectId FK
        string number
        int amount
        string currency
        string status "unpaid | paid | overdue"
    }
    InvoiceDispute {
        string id PK
        string invoiceId FK
        string clientId FK
        string reason
        string status "open | reviewing | resolved"
    }
    Notification {
        string id PK
        string clientId FK
        string title
        bool read
    }
    NotificationPreference {
        string id PK
        string clientId FK
        string category "messages | invoices | projects | files | system"
        bool push
        bool email
    }
    PushSubscription {
        string id PK
        string endpoint
        string ownerType
        string ownerId
    }

    Client ||--o{ ClientTeamMember        : "has"
    Client ||--o{ Project                 : "owns"
    Client ||--o{ Invoice                 : "billed via"
    Client ||--o{ Notification            : "receives"
    Client ||--o{ NotificationPreference  : "configures"
    Project ||--o{ Milestone              : "has"
    Project ||--o{ ProjectUpdate          : "has"
    Project ||--o{ ProjectFile            : "contains"
    Project ||--o{ ProjectComment         : "has"
    Invoice ||--o| InvoiceDispute         : "disputed via"
```

### CMS, Newsroom + Agency Ops

```mermaid
erDiagram
    BlogPost {
        string id PK
        string slug
        string title
        string category
        bool published
        bool featured
    }
    PortfolioProject {
        string id PK
        string slug
        string title
        string client
        string vertical
        bool published
    }
    Job {
        string id PK
        string title
        string department
        string type
        bool active
    }
    Event {
        string id PK
        string slug
        string title
        string type
        bool published
    }
    Resource {
        string id PK
        string slug
        string type
        string title
        bool published
    }
    Announcement {
        string id PK
        string slug
        string type
        string title
        bool published
    }
    KnowledgeArticle {
        string id PK
        string slug
        string title
        string category
        bool published
        int order
    }
    NewsArticle {
        string id PK
        string url
        string slug
        string title
        string source
        datetime publishedAt
    }
    NewsArticleBlocklist {
        string id PK
        string url
        datetime deletedAt
    }
    NewsArticleScrapeAttempt {
        string id PK
        string url
        int attempts
        datetime lastAttempt
    }
    FormSubmission {
        string id PK
        string type
        json data
        string status "new | read | archived"
    }
    Lead {
        string id PK
        string email
        string name
        string source
        string[] tags
    }

    NewsArticle }o--o| NewsArticleBlocklist     : "blocked by"
    NewsArticle ||--o{ NewsArticleScrapeAttempt : "tracked via"
```

---

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- [Neon](https://neon.tech) PostgreSQL database
- [Pusher](https://pusher.com) Channels app
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
```

### 3. Environment

```bash
cp .env.example .env.local
```

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

# Feature flags (hides sections until content is ready)
NEXT_PUBLIC_HIDE_TESTIMONIALS=true
NEXT_PUBLIC_HIDE_CASE_STUDIES=true
NEXT_PUBLIC_HIDE_ANNOUNCEMENTS=true
NEXT_PUBLIC_HIDE_TEAM=true
```

### 4. Database

```bash
bun run db:push
bun run db:seed            # admin user
bun run db:seed-cms        # blog, portfolio, careers
bun run db:seed-portal     # client portal demo data
bun run db:seed-portfolio  # portfolio projects
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

## Feature Flags

| Flag | Effect |
|---|---|
| `NEXT_PUBLIC_HIDE_TESTIMONIALS` | Hides testimonial sections sitewide |
| `NEXT_PUBLIC_HIDE_CASE_STUDIES` | Hides portfolio sections, redirects `/portfolio` to home |
| `NEXT_PUBLIC_HIDE_ANNOUNCEMENTS` | Hides company announcements in the newsroom |
| `NEXT_PUBLIC_HIDE_TEAM` | Hides the Team section on the About page |

---

## Scripts

```bash
# Development
bun dev              # Start dev server → :3000
bun build            # prisma generate + next build
bun start            # Serve production build
bun lint             # ESLint

# Testing
bun test             # Run Vitest suite
bun run test:watch   # Watch mode

# Database
bun run db:push            # Push schema to database
bun run db:migrate         # Run prisma migrate dev
bun run db:studio          # Open Prisma Studio GUI
bun run db:seed            # Seed admin user
bun run db:seed-cms        # Seed blog, portfolio, careers
bun run db:seed-portal     # Seed client portal demo data
bun run db:seed-portfolio  # Seed portfolio projects

# News sync (manual trigger)
curl -H "Authorization: Bearer $CRON_SECRET" https://your-domain.com/api/news/sync
```

---

<div align="center">

[Jessy Chidera Onah](https://github.com/cirostackdev)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/jessyonah)
[![Email](https://img.shields.io/badge/Email-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:jessychideraonah@gmail.com)

<a href="https://cirostack.com"><img src="./assets/cirostack-wordmark.svg" alt="CiroStack" height="120" /></a>

</div>
