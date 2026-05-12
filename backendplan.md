# Backend Implementation Plan — CiroStack (friendly-greetings)

> **Date:** 2026-05-12  
> **Scope:** Full backend + custom chat widget (replacing Tawk.to)

---

## 1. Current State Summary

| Area | Status |
|---|---|
| Database | None — all data is static JSON |
| API routes | 8 thin routes (email via Resend, news aggregation) |
| Chat | Tawk.to script injection (`src/components/LiveChat.tsx`) |
| Auth | None |
| Admin panel | None |
| Real-time | None |

---

## 2. Target Architecture

```
Browser
  ├── Next.js frontend (existing)
  ├── Custom Chat Widget (new)  ←── replaces LiveChat.tsx
  └── Admin Panel /admin/* (new)
          │
Next.js Custom Server  (server.ts — replaces default next start)
  ├── Next.js HTTP handler  (all existing pages/API routes unchanged)
  └── Socket.io server      (chat WebSocket layer)
          │
API Layer (src/app/api/*)
  ├── /api/chat/*        (new — REST for history + socket auth)
  ├── /api/admin/*       (new — secured with session)
  └── /api/contact/*     (existing — rate-limited Resend routes)
          │
Database  PostgreSQL  (via Prisma)
  ├── conversations
  ├── messages
  ├── admins
  ├── leads
  └── form_submissions
          │
External Services (existing)
  ├── Resend          (email)
  ├── Guardian API    (news)
  └── Google Analytics / Meta Pixel
```

---

## 3. Tech Stack Additions

| Package | Purpose |
|---|---|
| `socket.io` + `socket.io-client` | Real-time bidirectional chat |
| `prisma` + `@prisma/client` | Database ORM |
| `@auth/nextjs` (NextAuth v5) | Admin authentication |
| `postgres` (pg driver via Prisma) | PostgreSQL connection |
| `bcryptjs` | Admin password hashing |
| `zod` (already installed) | Server-side input validation |
| `uuid` | Visitor ID generation |

**Database host recommendation:** Neon (serverless PostgreSQL, generous free tier, works with Prisma seamlessly)

---

## 4. Database Schema

### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Admin {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  role         String   @default("agent")   // "agent" | "super"
  online       Boolean  @default(false)
  createdAt    DateTime @default(now())
  conversations Conversation[]
}

model Conversation {
  id          String    @id @default(cuid())
  visitorId   String                          // anonymous browser UUID
  visitorName String?
  visitorEmail String?
  topic       String?
  status      String    @default("open")      // "open" | "closed" | "queued"
  assignedTo  Admin?    @relation(fields: [assignedToId], references: [id])
  assignedToId String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  messages    Message[]
  metadata    Json?                            // page URL, user agent, etc.
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  senderType     String                        // "visitor" | "agent" | "system"
  senderId       String?                       // admin ID if agent
  senderName     String?
  body           String
  fileUrl        String?
  read           Boolean      @default(false)
  createdAt      DateTime     @default(now())
}

model FormSubmission {
  id         String   @id @default(cuid())
  type       String                           // "start" | "consultation" | "careers" | "press" | "events" | "newsletter"
  data       Json                             // full form payload
  status     String   @default("new")         // "new" | "reviewed" | "actioned"
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Lead {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  source    String?                           // "newsletter" | "chat" | "consultation" | etc.
  tags      String[]
  metadata  Json?
  createdAt DateTime @default(now())
}
```

---

## 5. Custom Server Setup

Replace `next start` with a custom server that co-hosts Socket.io.

### `server.ts` (project root)

```typescript
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketServer } from "socket.io";
import { setupChatSocket } from "./src/sockets/chat";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketServer(httpServer, {
    path: "/api/socket",
    cors: { origin: process.env.NEXT_PUBLIC_SITE_URL, credentials: true },
  });

  setupChatSocket(io);

  const port = parseInt(process.env.PORT || "3000", 10);
  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
```

Update `package.json` scripts:
```json
"dev":   "ts-node server.ts",
"start": "NODE_ENV=production ts-node server.ts"
```

---

## 6. Socket.io Chat Layer

### `src/sockets/chat.ts`

Responsibilities:
- Authenticate admin connections (validate session cookie → DB admin lookup)
- Assign anonymous visitors a persistent UUID (stored in `localStorage`)
- Route events between visitor socket and assigned agent socket
- Persist every message to `Message` table via Prisma
- Broadcast admin online/offline status to visitors
- Emit `typing` and `read` events

**Socket events:**

| Direction | Event | Payload |
|---|---|---|
| visitor → server | `visitor:join` | `{ visitorId, name?, email?, topic?, pageUrl }` |
| visitor → server | `visitor:message` | `{ conversationId, body }` |
| visitor → server | `visitor:typing` | `{ conversationId, typing: bool }` |
| server → visitor | `conversation:created` | `{ conversationId, queuePosition }` |
| server → visitor | `agent:message` | `{ message }` |
| server → visitor | `agent:typing` | `{ typing: bool }` |
| server → visitor | `agent:online` | `{ online: bool }` |
| admin → server | `admin:join` | `{ token }` |
| admin → server | `admin:claim` | `{ conversationId }` |
| admin → server | `admin:message` | `{ conversationId, body }` |
| admin → server | `admin:typing` | `{ conversationId, typing: bool }` |
| admin → server | `admin:close` | `{ conversationId }` |
| server → admin | `conversation:new` | `{ conversation }` |
| server → admin | `visitor:message` | `{ message }` |
| server → admin | `visitor:typing` | `{ conversationId, typing: bool }` |

---

## 7. Chat REST API Routes

### `src/app/api/chat/`

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/chat/conversations` | Create conversation, return ID + socket token |
| GET | `/api/chat/conversations/[id]/messages` | Load history (visitor with matching visitorId) |
| POST | `/api/chat/socket-token` | Issue short-lived JWT for socket auth |

---

## 8. Custom Chat Widget (Frontend)

Replace `src/components/LiveChat.tsx` entirely. New component: `src/components/Chat/ChatWidget.tsx`.

### Structure

```
src/components/Chat/
  ChatWidget.tsx        — main floating widget (launcher button + panel)
  ChatPanel.tsx         — message thread + input
  ChatMessage.tsx       — single message bubble
  PreChatForm.tsx       — name / email / topic form shown before first message
  TypingIndicator.tsx   — animated dots
  useChat.ts            — custom hook: socket connection, state, actions
```

### UX Flow

```
1. User lands on page
   → ChatWidget renders a floating button (bottom-right)
   → If admins online: "We're online" green dot
   → If offline: "Leave a message" label

2. User clicks button → panel opens
   → If new visitor: PreChatForm (name, email, topic — all optional)
   → On submit (or skip): connect socket, emit visitor:join
   → conversationId returned and stored in localStorage

3. Active conversation
   → Message thread with timestamps
   → Typing indicator when agent types
   → Read receipts (✓✓) on visitor messages
   → File/image upload button (uploads to /api/chat/upload → stored URL)

4. Returning visitor (has conversationId in localStorage)
   → Skip pre-chat form, load history, rejoin socket room

5. Offline mode
   → No socket connection
   → Input replaced with email + message form
   → Submits to /api/contact/start (existing) with chat tag
```

### Offline Detection

`useChat.ts` pings `GET /api/chat/status` (returns `{ online: bool }` based on connected admin sockets). Updates every 30 seconds.

---

## 9. Admin Panel

### Routes: `src/app/admin/`

| Path | Component | Purpose |
|---|---|---|
| `/admin` | redirect to `/admin/conversations` | — |
| `/admin/login` | `LoginPage` | Admin login form |
| `/admin/conversations` | `ConversationsPage` | List open/closed chats |
| `/admin/conversations/[id]` | `ConversationDetail` | Chat thread + visitor info |
| `/admin/submissions` | `SubmissionsPage` | All form submissions (start, consultation, etc.) |
| `/admin/leads` | `LeadsPage` | Lead list with source/tags |
| `/admin/settings` | `SettingsPage` | Manage admin accounts |

### Admin Auth (NextAuth v5)

- Provider: `Credentials` (email + password against `Admin` table)
- Session strategy: `jwt`
- Middleware: `src/middleware.ts` extended to protect `/admin/*` routes (redirect to `/admin/login` if unauthenticated)
- Passwords hashed with `bcryptjs`

### Seed Script

`prisma/seed.ts` — creates initial super-admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars.

---

## 10. Form Submission Persistence

Update all existing API routes in `src/app/api/contact/*` and `src/app/api/events/*` to:
1. Continue sending Resend emails (unchanged)
2. **Additionally** write to `FormSubmission` table and `Lead` table via Prisma

No breaking changes to existing behavior.

---

## 11. Environment Variables to Add

```env
# Database
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require

# NextAuth
NEXTAUTH_SECRET=<random 32-byte hex>
NEXTAUTH_URL=http://localhost:3000

# Admin seed (used only during prisma db seed)
ADMIN_EMAIL=admin@cirostack.com
ADMIN_PASSWORD=<strong-password>

# Site URL (for socket CORS)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 12. File Upload (Chat Attachments)

### `src/app/api/chat/upload/route.ts`

- Accept multipart form-data
- Validate: max 10 MB, types: image/*, application/pdf
- Storage options (pick one):
  - **Cloudflare R2** — S3-compatible, no egress fees (recommended)
  - **AWS S3** — standard option
  - **Local `/public/uploads`** — dev only, not for production
- Return: `{ url: string }`

---

## 13. Implementation Order

### Phase 1 — Foundation (Days 1–2)
- [ ] Install Prisma, Socket.io, NextAuth, bcryptjs
- [ ] Set up Neon PostgreSQL database
- [ ] Write `prisma/schema.prisma` and run `prisma migrate dev`
- [ ] Write `prisma/seed.ts` and seed initial admin
- [ ] Create `server.ts` custom server, update `package.json` scripts

### Phase 2 — Chat Backend (Days 3–4)
- [ ] Implement `src/sockets/chat.ts` (full socket event handling)
- [ ] Implement `src/app/api/chat/conversations/route.ts`
- [ ] Implement `src/app/api/chat/status/route.ts`
- [ ] Implement `src/app/api/chat/socket-token/route.ts`
- [ ] Implement `src/app/api/chat/upload/route.ts`

### Phase 3 — Chat Widget (Days 5–6)
- [ ] Create `useChat.ts` hook (socket connection, state management)
- [ ] Create `PreChatForm.tsx`
- [ ] Create `ChatMessage.tsx` + `TypingIndicator.tsx`
- [ ] Create `ChatPanel.tsx`
- [ ] Create `ChatWidget.tsx` (launcher button + panel container)
- [ ] Delete `src/components/LiveChat.tsx`, remove Tawk env var
- [ ] Wire `ChatWidget` into root layout replacing `LiveChat`

### Phase 4 — Admin Panel (Days 7–9)
- [ ] Set up NextAuth v5 (`src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`)
- [ ] Extend `middleware.ts` to guard `/admin/*`
- [ ] Create `/admin/login` page
- [ ] Create `/admin/conversations` page (lists + real-time updates via socket)
- [ ] Create `/admin/conversations/[id]` page (chat interface for agents)
- [ ] Create `/admin/submissions` page
- [ ] Create `/admin/leads` page
- [ ] Create `/admin/settings` page (add/edit/deactivate admins)

### Phase 5 — Form Persistence (Day 10)
- [ ] Add Prisma writes to all existing contact API routes
- [ ] Add lead upsert to newsletter subscribe route
- [ ] Test end-to-end (form submit → DB write → email send)

### Phase 6 — File Uploads & Polish (Day 11)
- [ ] Set up Cloudflare R2 bucket (or S3)
- [ ] Implement upload route
- [ ] Add file picker to `ChatPanel.tsx`
- [ ] Notification: browser push or email when new chat arrives (admin offline)
- [ ] Read receipts + unread badge on admin panel sidebar

### Phase 7 — Testing & Hardening (Day 12)
- [ ] Rate-limit chat routes (extend existing middleware)
- [ ] Input sanitization on all chat messages (strip HTML)
- [ ] Test socket reconnection / dropped connections
- [ ] Test admin session expiry
- [ ] Load test chat with multiple concurrent conversations
- [ ] Verify Tawk.to fully removed (no script tags, no env var references)

---

## 14. Files to Create (Net New)

```
prisma/
  schema.prisma
  seed.ts
  migrations/          (auto-generated)

server.ts

src/
  auth.ts              (NextAuth config)
  lib/
    prisma.ts          (singleton PrismaClient)
    socket.ts          (socket.io client singleton for frontend)
  sockets/
    chat.ts            (server-side socket handlers)
  app/
    api/
      auth/
        [...nextauth]/
          route.ts
      chat/
        conversations/
          route.ts
          [id]/
            messages/
              route.ts
        status/
          route.ts
        upload/
          route.ts
        socket-token/
          route.ts
    admin/
      layout.tsx
      page.tsx
      login/
        page.tsx
      conversations/
        page.tsx
        [id]/
          page.tsx
      submissions/
        page.tsx
      leads/
        page.tsx
      settings/
        page.tsx
  components/
    Chat/
      ChatWidget.tsx
      ChatPanel.tsx
      ChatMessage.tsx
      PreChatForm.tsx
      TypingIndicator.tsx
      useChat.ts
```

## 15. Files to Modify

| File | Change |
|---|---|
| `src/components/LiveChat.tsx` | **Delete** — replaced by ChatWidget |
| `src/app/layout.tsx` | Swap `<LiveChat />` for `<ChatWidget />` |
| `src/middleware.ts` | Add `/admin/*` auth guard |
| `src/app/api/contact/*/route.ts` | Add Prisma `FormSubmission` + `Lead` writes |
| `src/app/api/newsletter/subscribe/route.ts` | Add Prisma `Lead` upsert |
| `src/app/api/events/register/route.ts` | Add Prisma `FormSubmission` write |
| `package.json` | Add new deps + update `dev`/`start` scripts |
| `.env.local` | Add `DATABASE_URL`, `NEXTAUTH_*`, `ADMIN_*`, remove `NEXT_PUBLIC_TAWK_PROPERTY_ID` |

---

## 16. Non-Goals (Out of Scope)

- CMS for blog/careers (JSON files are sufficient for now)
- Customer-facing account login / portal
- Payment processing
- Mobile push notifications
- Multi-language / i18n
- Horizontal scaling / Redis socket adapter (single instance is fine initially)
