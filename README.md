# Friendly Greetings

A full-featured customer messaging platform with real-time chat, client portal, and agency management tools. Built for service businesses and agencies to communicate with clients, manage projects, invoices, and deliver exceptional service.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon) via Prisma ORM
- **Realtime**: Pusher Channels
- **File Storage**: Vercel Blob
- **Payments**: Paystack
- **Auth**: NextAuth.js (separate admin + client auth)
- **UI**: Lucide icons, Sonner toasts, Recharts

## Getting Started

```bash
# Install dependencies
npm install

# Push database schema
npx prisma db push

# Run development server
npm run dev
```

The app requires the following environment variables in `.env.local`:

- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — Auth secret
- `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `NEXT_PUBLIC_PUSHER_KEY`, `NEXT_PUBLIC_PUSHER_CLUSTER` — Pusher config
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob storage
- `PAYSTACK_SECRET_KEY`, `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` — Payment processing
- `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` — Web push notifications

## Architecture

### Three Chat Views (kept in sync via Pusher)

1. **Widget** (`/`) — Visitor-facing embeddable chat widget
2. **Admin** (`/admin/conversations`) — Agent inbox with split-panel layout
3. **Portal** (`/portal/chat`) — Client-facing chat dashboard

### Admin Panel (`/admin`)

| Section | Description |
|---------|-------------|
| Dashboard | KPIs, recent payments, leads, quick actions |
| Analytics | Multi-tab: Overview, Pipeline, Financial, Projects, Content, SLA, CSAT, Agents |
| Conversations | Real-time inbox with split layout, tags, search, bulk actions |
| Search | Global message search across all conversations |
| Submissions | Form submissions with status tracking, CSV export |
| Leads | Pipeline management with status cycling, tags, CSV export, convert-to-client |
| CMS | Blog, Portfolio, Jobs, Events, Resources, Announcements, News |
| Clients | Client profiles with projects, invoices, and conversation history |
| Projects | Full project lifecycle with milestones, updates, files, comments |
| Invoices | Create, send, track payments, export CSV |
| Revenue | Monthly charts, payment history, CSV export |
| Canned Responses | Quick-reply templates insertable via `/` in chat |
| Knowledge Base | FAQ/help articles (CRUD), published to portal Help Center |
| Automation | Rule-based auto-replies, keyword triggers, assignment rules |
| Settings | Team management, SLA config, tags, business hours, widget config |

### Client Portal (`/portal`)

| Section | Description |
|---------|-------------|
| Dashboard | KPIs, project progress, invoice alerts, recent activity |
| Projects | View projects, approve milestones, post comments |
| Invoices | View, pay (Paystack), download PDF, dispute |
| Files | All project deliverables with download |
| Messages | Real-time chat with agent, reactions, voice notes, media |
| Search | Global search across projects, invoices, files, messages |
| Notifications | Notification center with read/unread filtering |
| Help Center | Searchable knowledge base articles |
| Analytics | Monthly spend trends, project status breakdown |
| Settings | Profile, password, notification preferences, team members |

### Key Features

- **Real-time messaging** — Pusher-powered with typing/recording indicators, presence, read receipts
- **WhatsApp-style UX** — Reply threading, reactions, swipe-to-reply, voice notes, link previews, media bubbles
- **Business Hours** — Schedule-based online/offline with auto-message
- **Widget Configuration** — Admin-customizable colors, position, welcome/offline messages, pre-chat form
- **SLA Tracking** — First response time monitoring with compliance metrics
- **CSAT** — Post-conversation ratings with analytics
- **Automation** — Keyword triggers, offline auto-replies, no-response timeouts
- **Assignment Rules** — Round-robin, topic-based, and load-balanced routing
- **Conversation Tags** — Color-coded labels for organization and filtering
- **Internal Notes** — Private agent notes on conversations (sticky-note style)
- **Bulk Actions** — Multi-select conversations for batch close/assign/delete
- **Export** — CSV export for conversations, invoices, revenue data
- **Team Management** — Portal clients can invite team members with roles
- **Invoice Disputes** — Clients can flag issues, admins can review and resolve
- **Transfer with Notes** — Handoff context when reassigning conversations

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed admin data
npm run db:seed-cms  # Seed CMS content
npm run test         # Run tests
```

## Project Structure

```
src/
├── app/
│   ├── admin/          # Admin panel pages
│   ├── portal/         # Client portal pages
│   ├── api/            # API routes
│   │   ├── admin/      # Admin APIs (auth required)
│   │   ├── portal/     # Portal APIs (client auth)
│   │   ├── csat/       # Public CSAT submission
│   │   └── widget-config/ # Public widget config
│   └── ...
├── components/
│   ├── admin/          # Admin components (AdminShell, NotesPanel, etc.)
│   ├── portal/         # Portal components (PortalShell)
│   ├── Chat/           # Shared chat components
│   └── ui/             # Base UI components
├── lib/                # Utilities (prisma, pusher, colors, etc.)
└── auth.ts / auth-client.ts  # Auth configurations
```

## Database

Uses Prisma with PostgreSQL. Schema managed via `prisma db push` (no migrations folder).

Key models: `Admin`, `Conversation`, `Message`, `Client`, `Project`, `Invoice`, `CannedResponse`, `ConversationTag`, `BusinessHours`, `WidgetConfig`, `AutomationRule`, `AssignmentRule`, `InternalNote`, `KnowledgeArticle`, `SLAConfig`, `CSATRating`, `NotificationPreference`, `InvoiceDispute`, `ClientTeamMember`.
