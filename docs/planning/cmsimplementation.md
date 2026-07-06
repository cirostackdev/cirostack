# CMS & Product Feature Implementation Plan

> **Date:** 2026-05-12  
> **Scope:** CMS (blog + careers), customer portal + auth, payment processing, mobile push notifications

---

## 1. Current State

| Feature | Status |
|---|---|
| Blog | 16 posts in `public/content/blog-posts.json`, images mapped in `src/data/blog.ts` |
| Careers | 7 jobs in `public/content/careers.json` |
| Customer auth | None — only admin auth (NextAuth credentials) |
| Payments | None |
| Push notifications | None |
| Admin panel | Conversations, Submissions, Leads, Settings |

---

## 2. Feature 1 — CMS (Blog + Careers + Portfolio)

### 2.1 Approach

Extend the existing admin panel with CMS pages. No external headless CMS — data stays in the DB (Prisma). The JSON files remain as the initial seed; from launch forward, all edits go through the admin UI and are persisted to PostgreSQL.

**Why DB instead of editing JSON files?**  
Vercel deployments are immutable — editing a JSON file in production is impossible without a re-deploy. The DB is the only persistent store available.

---

### 2.2 Database Schema Additions

```prisma
model BlogPost {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  excerpt     String
  category    String
  author      String   @default("CiroStack Team")
  date        String
  dateSort    DateTime
  readMin     Int      @default(5)
  imageUrl    String?
  featured    Boolean  @default(false)
  published   Boolean  @default(false)
  tags        String[]
  body        String?  @db.Text   // full article markdown/HTML
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Job {
  id          String   @id @default(cuid())
  title       String
  department  String
  type        String   @default("Full-Time")
  location    String   @default("Remote")
  description String
  body        String?  @db.Text   // full job description markdown
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

### 2.3 Migration + Seed

`prisma/seed-cms.ts` — reads both JSON files and inserts rows if the tables are empty.

```bash
npm run db:seed-cms
```

---

### 2.4 API Routes

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/cms/posts` | List all published posts (public) |
| GET | `/api/cms/posts/[slug]` | Get single post by slug (public) |
| POST | `/api/admin/cms/posts` | Create post (admin auth) |
| PATCH | `/api/admin/cms/posts/[id]` | Update post (admin auth) |
| DELETE | `/api/admin/cms/posts/[id]` | Delete post (admin auth) |
| GET | `/api/cms/jobs` | List active jobs (public) |
| POST | `/api/admin/cms/jobs` | Create job (admin auth) |
| PATCH | `/api/admin/cms/jobs/[id]` | Update / deactivate job (admin auth) |
| DELETE | `/api/admin/cms/jobs/[id]` | Delete job (admin auth) |

---

### 2.5 Admin CMS Pages

```
src/app/admin/cms/
  blog/
    page.tsx              — post list (table: title, category, published, date, actions)
    new/page.tsx          — create post form
    [id]/page.tsx         — edit post form
  jobs/
    page.tsx              — job list (table: title, dept, type, active, actions)
    new/page.tsx          — create job form
    [id]/page.tsx         — edit job form
```

**Post editor fields:** slug, title, excerpt, category, author, date, readMin, imageUrl, tags, featured, published, body (markdown textarea with live preview)

**Job editor fields:** title, department, type (Full-Time/Contract/Part-Time), location, description, body (markdown), active toggle

---

### 2.6 Frontend Integration

Update `src/data/blog.ts` and the blog pages to prefer DB data:
- `src/app/blog/page.tsx` → calls `GET /api/cms/posts` (ISR, revalidate 60s)
- `src/app/blog/[id]/page.tsx` → calls `GET /api/cms/posts/[slug]`
- `src/app/careers/page.tsx` → calls `GET /api/cms/jobs`

Fall back to JSON if DB returns empty (safe during initial migration).

---

### 2.7 Image Uploads for Blog

Blog post images use `/api/chat/upload` already exists. Add `/api/admin/cms/upload` route (same logic, stores in `public/uploads/blog/`) and wire it to the image field in the post editor.

---

## 3. Feature 2 — Customer-Facing Account + Portal

### 3.1 What the Portal Does

Clients who have submitted a project brief or consultation request can:

- Log in to track their project status
- View messages / updates from the CiroStack team
- Access their invoices and payment history
- Download deliverables (files uploaded by admins)
- View a project timeline / milestone tracker

---

### 3.2 Database Schema Additions

```prisma
model Client {
  id             String    @id @default(cuid())
  email          String    @unique
  name           String?
  passwordHash   String?
  emailVerified  DateTime?
  avatarUrl      String?
  company        String?
  createdAt      DateTime  @default(now())
  projects       Project[]
  invoices       Invoice[]
}

model Project {
  id           String      @id @default(cuid())
  clientId     String
  client       Client      @relation(fields: [clientId], references: [id])
  title        String
  description  String?
  status       String      @default("discovery")
  // statuses: discovery | proposal | active | review | complete | paused
  startDate    DateTime?
  dueDate      DateTime?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  milestones   Milestone[]
  updates      ProjectUpdate[]
  files        ProjectFile[]
  invoices     Invoice[]
}

model Milestone {
  id          String   @id @default(cuid())
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id])
  title       String
  dueDate     DateTime?
  completed   Boolean  @default(false)
  completedAt DateTime?
  order       Int      @default(0)
}

model ProjectUpdate {
  id        String   @id @default(cuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  authorId  String?  // admin ID
  body      String
  internal  Boolean  @default(false)  // internal = not shown to client
  createdAt DateTime @default(now())
}

model ProjectFile {
  id        String   @id @default(cuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  name      String
  url       String
  size      Int?
  uploadedBy String?  // admin ID
  createdAt DateTime @default(now())
}

model Invoice {
  id          String    @id @default(cuid())
  clientId    String
  client      Client    @relation(fields: [clientId], references: [id])
  projectId   String?
  project     Project?  @relation(fields: [projectId], references: [id])
  number      String    @unique   // e.g. "INV-2026-001"
  amount      Int                 // in kobo/cents
  currency    String    @default("USD")
  status      String    @default("unpaid")
  // statuses: unpaid | paid | partial | overdue | cancelled
  dueDate     DateTime?
  paidAt      DateTime?
  paymentRef  String?   // Paystack/Stripe reference
  lineItems   Json                // [{description, qty, unitPrice}]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

---

### 3.3 Auth — Client Auth (Separate from Admin Auth)

Keep admin auth and client auth **completely separate**:

- Admin: NextAuth credentials at `/admin/login` (existing, unchanged)
- Client: separate NextAuth config at `src/auth-client.ts` using credentials + magic link (email OTP)

```
src/auth-client.ts          — client NextAuth config
src/app/(portal)/           — route group, own layout
  layout.tsx                — portal shell (logo, nav, signout)
  login/page.tsx            — email input → sends magic link
  verify/page.tsx           — OTP/token verification
  dashboard/page.tsx        — project overview
  projects/[id]/page.tsx    — project detail (timeline, updates, files)
  invoices/page.tsx         — invoice list
  invoices/[id]/page.tsx    — invoice detail + pay button
  settings/page.tsx         — update name, password
src/middleware.ts           — extend to protect /(portal)/* routes
src/app/api/auth-client/[...nextauth]/route.ts
```

**Sign-in flow:**
1. Client enters email → server checks if `Client` row exists → sends 6-digit OTP via Resend
2. Client enters OTP → verified → session created (JWT, 30-day expiry)
3. Alternatively: password-based login (for clients who set a password)

**Account creation:**
- Admin creates a `Client` record from the admin panel and links it to a `Project`
- OR: client self-registers via `/portal/login` (email → OTP → account auto-created)

---

### 3.4 Admin Panel Additions for Portal Management

```
src/app/admin/clients/
  page.tsx                  — client list
  [id]/page.tsx             — client detail (create project, add update, upload file)
src/app/admin/projects/
  page.tsx                  — all projects
  [id]/page.tsx             — project detail (milestones, updates, files, invoices)
src/app/admin/invoices/
  page.tsx                  — all invoices
  new/page.tsx              — create invoice form
```

Add to admin sidebar: **Clients**, **Projects**, **Invoices**.

---

### 3.5 Portal API Routes

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/portal/projects` | Client's projects (client auth) |
| GET | `/api/portal/projects/[id]` | Project detail |
| GET | `/api/portal/invoices` | Client's invoices |
| POST | `/api/portal/invoices/[id]/pay` | Initiate payment |
| POST | `/api/admin/clients` | Create client (admin) |
| POST | `/api/admin/projects` | Create project (admin) |
| PATCH | `/api/admin/projects/[id]` | Update project status/milestones |
| POST | `/api/admin/projects/[id]/updates` | Post update to client |
| POST | `/api/admin/projects/[id]/files` | Upload deliverable |
| POST | `/api/admin/invoices` | Create invoice (admin) |

---

## 4. Feature 3 — Payment Processing

### 4.1 Payment Provider

**Primary: Paystack** (best for Africa / Nigeria, NGN + USD support, no chargebacks nightmare)  
**Secondary: Stripe** (for international clients paying in USD/GBP/EUR)

Install:
```bash
npm install paystack-node
# or use raw fetch against Paystack REST API (simpler, no SDK needed)
```

---

### 4.2 Payment Flow (Paystack)

```
1. Admin creates Invoice → status: "unpaid"
2. Client opens invoice in portal → clicks "Pay Now"
3. POST /api/portal/invoices/[id]/pay
   → server creates Paystack transaction (initialize)
   → returns { authorization_url }
4. Client is redirected to Paystack checkout page
5. On success, Paystack redirects to /portal/invoices/[id]/success?reference=xxx
6. POST /api/webhooks/paystack
   → verify signature (HMAC-SHA512)
   → update Invoice.status = "paid", Invoice.paidAt, Invoice.paymentRef
   → send receipt email via Resend
```

---

### 4.3 New Files

```
src/app/api/portal/invoices/[id]/pay/route.ts     — initiate Paystack txn
src/app/api/webhooks/paystack/route.ts             — Paystack webhook handler
src/app/(portal)/invoices/[id]/success/page.tsx   — post-payment confirmation
src/lib/paystack.ts                                — Paystack helpers (init, verify)
src/lib/stripe.ts                                  — Stripe helpers (optional, for intl)
```

---

### 4.4 New Environment Variables

```env
PAYSTACK_SECRET_KEY=sk_live_xxx
PAYSTACK_PUBLIC_KEY=pk_live_xxx
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx           # optional
STRIPE_WEBHOOK_SECRET=whsec_xxx        # optional
PORTAL_URL=https://cirostack.com        # for redirect after payment
```

---

### 4.5 Invoice PDF Generation

Use `@react-pdf/renderer` to generate a PDF invoice on demand:

```
GET /api/portal/invoices/[id]/pdf     → streams PDF
```

Admin and client can both download. Rendered server-side with React PDF.

---

## 5. Feature 4 — Mobile Push Notifications

### 5.1 Scope

Push notifications for:
- **Clients (portal):** new project update, invoice created, milestone completed
- **Admins (internal):** new chat message, new form submission, new lead

### 5.2 Technology Choice

**Web Push (VAPID)** — works on all modern browsers including mobile Chrome/Safari/Firefox. No native app needed, zero cost, no third-party service required.

For native mobile app notifications in the future: **Expo Push Notifications** (if a React Native app is built later).

Install:
```bash
npm install web-push
npm install -D @types/web-push
```

---

### 5.3 Database Schema

```prisma
model PushSubscription {
  id         String   @id @default(cuid())
  endpoint   String   @unique
  p256dh     String
  auth       String
  ownerType  String   // "client" | "admin"
  ownerId    String
  createdAt  DateTime @default(now())
}
```

---

### 5.4 Flow

```
1. User visits site (portal or admin panel)
2. Browser prompts for notification permission
3. Service worker registers and gets PushSubscription object
4. POST /api/push/subscribe → save to DB
5. On trigger events (new update, invoice, etc.):
   → server-side: fetch all matching PushSubscriptions
   → call web-push.sendNotification() for each
6. Service worker receives push → shows notification with title + body + url
```

---

### 5.5 New Files

```
public/sw.js                              — service worker (handles push events)
src/app/api/push/subscribe/route.ts       — save subscription
src/app/api/push/unsubscribe/route.ts     — remove subscription
src/lib/push.ts                           — sendPush(ownerId, type, payload) helper
src/hooks/usePushNotifications.ts         — client hook: register SW, subscribe, prompt
src/components/PushPermissionBanner.tsx   — "Enable notifications?" banner for portal
```

---

### 5.6 Trigger Points

| Event | Recipients | Triggered from |
|---|---|---|
| New project update posted | Client | `POST /api/admin/projects/[id]/updates` |
| Invoice created | Client | `POST /api/admin/invoices` |
| Invoice paid | Admin | Paystack webhook |
| Milestone completed | Client | `PATCH /api/admin/projects/[id]` |
| New chat message (visitor) | Admin | Socket.io `visitor:message` handler |
| New form submission | Admin | All `/api/contact/*` routes |

---

### 5.7 New Environment Variables

```env
VAPID_PUBLIC_KEY=xxx     # generate with: npx web-push generate-vapid-keys
VAPID_PRIVATE_KEY=xxx
NEXT_PUBLIC_VAPID_PUBLIC_KEY=xxx
VAPID_EMAIL=mailto:contact@cirostack.com
```

---

## 6. Implementation Order

### Phase 1 — CMS (Days 1–3)
- [ ] Add `BlogPost` + `Job` to Prisma schema, `db push`
- [ ] Seed from existing JSON files (`prisma/seed-cms.ts`)
- [ ] Build admin CMS pages (blog list, new/edit form, jobs list, new/edit form)
- [ ] Create public + admin API routes for posts and jobs
- [ ] Update `src/app/blog/` and `src/app/careers/` to read from DB (ISR)
- [ ] Wire image upload to blog post editor

### Phase 2 — Customer Portal Auth (Days 4–5)
- [ ] Add `Client` to schema, `db push`
- [ ] Create `src/auth-client.ts` (magic link via Resend OTP + optional password)
- [ ] Build portal login + verify pages
- [ ] Extend middleware to protect `/(portal)/*`
- [ ] Build portal layout + dashboard skeleton

### Phase 3 — Projects + Portal Pages (Days 6–8)
- [ ] Add `Project`, `Milestone`, `ProjectUpdate`, `ProjectFile` to schema
- [ ] Build admin: Clients, Projects pages (create client, link to project)
- [ ] Build portal: `/portal/dashboard`, `/portal/projects/[id]`
- [ ] Project update feed + file downloads
- [ ] Add "Clients" and "Projects" to admin sidebar

### Phase 4 — Payments (Days 9–11)
- [ ] Add `Invoice` to schema, `db push`
- [ ] Build admin invoice creation form
- [ ] Build portal invoice list + detail pages
- [ ] Integrate Paystack: `/api/portal/invoices/[id]/pay` + webhook
- [ ] Implement receipt email (Resend) on payment success
- [ ] PDF invoice generation (`@react-pdf/renderer`)
- [ ] Add "Invoices" to admin sidebar

### Phase 5 — Push Notifications (Days 12–13)
- [ ] Generate VAPID keys, add to env
- [ ] Add `PushSubscription` to schema
- [ ] Create `public/sw.js` service worker
- [ ] Create subscribe/unsubscribe API routes
- [ ] Build `usePushNotifications` hook + `PushPermissionBanner`
- [ ] Add `sendPush()` helper
- [ ] Wire notification triggers into all relevant API routes

### Phase 6 — Polish + Deploy (Day 14)
- [ ] End-to-end test: blog publish → live on site
- [ ] End-to-end test: client login → view project → pay invoice → receive notification
- [ ] Rate-limit portal auth routes (prevent OTP brute-force)
- [ ] Add all new env vars to Vercel
- [ ] Push to remote, redeploy

---

## 7. New Dependencies Summary

| Package | Purpose |
|---|---|
| `web-push` | VAPID push notifications |
| `@react-pdf/renderer` | Invoice PDF generation |
| `marked` or `react-markdown` | Render blog/job body markdown |
| `@uiw/react-md-editor` | Markdown editor in admin CMS |

No Stripe SDK needed initially (use raw Paystack REST); add Stripe later if international volume justifies it.

---

## 8. Files to Create (Net New)

```
prisma/seed-cms.ts

src/auth-client.ts
src/auth-client.config.ts

public/sw.js

src/lib/paystack.ts
src/lib/push.ts
src/hooks/usePushNotifications.ts
src/components/PushPermissionBanner.tsx

src/app/(portal)/
  layout.tsx
  login/page.tsx
  verify/page.tsx
  dashboard/page.tsx
  projects/[id]/page.tsx
  invoices/page.tsx
  invoices/[id]/page.tsx
  invoices/[id]/success/page.tsx
  settings/page.tsx

src/app/api/auth-client/[...nextauth]/route.ts
src/app/api/portal/projects/route.ts
src/app/api/portal/projects/[id]/route.ts
src/app/api/portal/invoices/route.ts
src/app/api/portal/invoices/[id]/pay/route.ts
src/app/api/portal/invoices/[id]/pdf/route.ts
src/app/api/push/subscribe/route.ts
src/app/api/push/unsubscribe/route.ts
src/app/api/webhooks/paystack/route.ts

src/app/admin/cms/blog/page.tsx
src/app/admin/cms/blog/new/page.tsx
src/app/admin/cms/blog/[id]/page.tsx
src/app/admin/cms/jobs/page.tsx
src/app/admin/cms/jobs/new/page.tsx
src/app/admin/cms/jobs/[id]/page.tsx
src/app/admin/clients/page.tsx
src/app/admin/clients/[id]/page.tsx
src/app/admin/projects/page.tsx
src/app/admin/projects/[id]/page.tsx
src/app/admin/invoices/page.tsx
src/app/admin/invoices/new/page.tsx

src/app/api/admin/cms/posts/route.ts
src/app/api/admin/cms/posts/[id]/route.ts
src/app/api/admin/cms/jobs/route.ts
src/app/api/admin/cms/jobs/[id]/route.ts
src/app/api/admin/clients/route.ts
src/app/api/admin/clients/[id]/route.ts
src/app/api/admin/projects/route.ts
src/app/api/admin/projects/[id]/route.ts
src/app/api/admin/projects/[id]/updates/route.ts
src/app/api/admin/projects/[id]/files/route.ts
src/app/api/admin/invoices/route.ts
src/app/api/admin/invoices/[id]/route.ts

src/app/api/cms/posts/route.ts
src/app/api/cms/posts/[slug]/route.ts
src/app/api/cms/jobs/route.ts
```

## 9. Files to Modify

| File | Change |
|---|---|
| `prisma/schema.prisma` | Add BlogPost, Job, Client, Project, Milestone, ProjectUpdate, ProjectFile, Invoice, PushSubscription |
| `src/middleware.ts` | Add `/(portal)/*` auth guard using client session |
| `src/components/admin/AdminShell.tsx` | Add CMS, Clients, Projects, Invoices to sidebar nav |
| `src/app/blog/page.tsx` | Fetch from DB via API instead of JSON |
| `src/app/blog/[id]/page.tsx` | Fetch post body from DB |
| `src/app/careers/page.tsx` | Fetch jobs from DB |
| `src/app/api/contact/start/route.ts` | Send push notification to admins on new submission |
| `src/sockets/chat.ts` | Send push notification to admins on new visitor message |
| `.env.local` | Add PAYSTACK_*, VAPID_*, PORTAL_URL |
