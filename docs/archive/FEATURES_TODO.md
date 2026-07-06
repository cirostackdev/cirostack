# Admin Dashboard & Client Portal — Features & Functionalities To-Do

_Last updated: 2026-05-13_

This document lists every feature and piece of functionality that still needs to be built, fixed, or completed across the admin dashboard and client portal. Items marked **[bug]** are broken in the current codebase. Items marked **[partial]** have some scaffolding but are incomplete.

---

## 1. Admin — Conversations

| # | Feature | Notes |
|---|---------|-------|
| 1.1 | **Assign conversation to admin** | `assignedTo` field exists in DB and is shown in sidebar, but there is no UI to assign or reassign from the conversation detail view |
| 1.2 | **Search & filter conversations** | No search by visitor name/email; filter is only open/closed/all |
| 1.3 | **Conversation list pagination** | Currently hard-capped at 100; needs pagination or infinite scroll |
| 1.4 | **Internal agent notes** | Ability to add private notes inside a conversation thread, separate from messages sent to visitor |
| 1.5 | **Bulk actions** | Close multiple conversations at once, bulk archive/delete |
| 1.6 | **Conversation transfer** | Reassign an open conversation to a different admin agent |
| 1.7 | **Visitor email capture prompt** | When a visitor hasn't provided email, admin can request it from the thread UI |

---

## 2. Admin — Submissions

| # | Feature | Notes |
|---|---------|-------|
| 2.1 | **Export to CSV** | Download all or filtered submissions as a CSV file |
| 2.2 | **Reply by email** | Click a submission and send a reply email to the submitter's address |
| 2.3 | **Bulk delete** | Select and delete multiple submissions at once |
| 2.4 | **Search** | No search across submission data |
| 2.5 | **Submission detail page** | Dedicated page per submission instead of accordion expand with raw JSON |
| 2.6 | **Convert to lead** | One-click action to promote a submission's email into the Leads table |

---

## 3. Admin — Leads

| # | Feature | Notes |
|---|---------|-------|
| 3.1 | **Add lead manually** | No UI to create a lead; only auto-created from forms |
| 3.2 | **Edit lead** | Cannot update name, source, or tags on an existing lead |
| 3.3 | **Delete lead** | No delete action |
| 3.4 | **Tag management** | Tags are visible but cannot be added/removed from the UI |
| 3.5 | **Search & filter** | No search by email/name, no filter by source or tag |
| 3.6 | **Export to CSV** | Export lead list |
| 3.7 | **Lead detail/notes** | No detail page; `metadata` field exists in DB but is unused |
| 3.8 | **Pagination** | Hard-capped at 500; needs pagination |

---

## 4. Admin — CMS (All Content Types)

### 4.1 Shared gaps across all CMS editors

| # | Feature | Notes |
|---|---------|-------|
| 4.1.1 | **Rich text / Markdown editor** | All `body` fields currently use plain `<Textarea>`. Needs a rich text or Markdown editor (e.g. TipTap, MDX, or react-md-editor) |
| 4.1.2 | **Image upload for all types** | Upload endpoint (`/api/admin/cms/upload`) only wired into Blog. Portfolio, Events, Resources, and Announcements have no image upload UI in their forms |
| 4.1.3 | **Preview before publish** | No way to preview how content will look on the public site before setting `published: true` |
| 4.1.4 | **Slug auto-generation** | Slug fields are manual on all types; should auto-generate from title with override option |
| 4.1.5 | **Duplicate / clone entry** | Useful for creating similar posts/events |

### 4.2 Blog

| # | Feature | Notes |
|---|---------|-------|
| 4.2.1 | **Tag autocomplete** | Tags are a comma-separated input; should be a chip/tag selector |
| 4.2.2 | **Featured image crop/preview** | Uploaded image URL is shown as text only; no preview thumbnail |

### 4.3 Portfolio

| # | Feature | Notes |
|---|---------|-------|
| 4.3.1 | **Image upload** | No image field in portfolio editor despite `imageUrl` in schema |
| 4.3.2 | **JSON field editors** | `keyFeatures`, `metrics`, `technologies`, `process`, `testimonial` etc. are stored as JSON but editing them requires raw JSON entry or is omitted from the form entirely — needs proper structured sub-form UI |

### 4.4 Events

| # | Feature | Notes |
|---|---------|-------|
| 4.4.1 | **Attendee count management** | `attendees` field in schema, not editable in form |
| 4.4.2 | **Registration URL** | `registrationUrl` in schema, may not be exposed in edit form |

### 4.5 Resources

| # | Feature | Notes |
|---|---------|-------|
| 4.5.1 | **File upload for downloadable resource** | `downloadUrl` stored as text; should support file upload |

---

## 5. Admin — Clients

| # | Feature | Notes |
|---|---------|-------|
| 5.1 | **Edit client** | No UI to update name, email, or company on an existing client |
| 5.2 | **Delete client** | No delete action |
| 5.3 | **Send email to client** | No "Email client" action from client detail view |
| 5.4 | **Client notes / activity log** | No internal notes or history visible on the client detail page |
| 5.5 | **Search clients** | No search by name/email/company on the clients list |
| 5.6 | **Invite client to portal** | No "Send portal invitation" button to email a client their portal login link |

---

## 6. Admin — Projects

| # | Feature | Notes |
|---|---------|-------|
| 6.1 | **Create milestones from UI** | Milestones can only be toggled; there is no way to add new milestones or set due dates from the project detail page |
| 6.2 | **Edit / delete milestones** | No milestone edit or delete |
| 6.3 | **Edit project title & description** | Detail page shows these read-only; no inline edit |
| 6.4 | **Set start date / due date** | Fields exist in schema, not exposed in the admin UI |
| 6.5 | **Delete project** | No delete action |
| 6.6 | **Delete / edit updates** | Posted updates cannot be edited or removed |
| 6.7 | **Delete files** | Uploaded files cannot be removed |
| 6.8 | **Reorder milestones** | `order` field in schema but no drag-to-reorder UI |
| 6.9 | **Notify client on update** | Updates are posted but the push notification to client is only fired on milestone completion; should also fire on new public update |

---

## 7. Admin — Invoices

| # | Feature | Notes |
|---|---------|-------|
| 7.1 | **Invoice detail view (admin)** | No admin-side detail/view page for an invoice; only the list and the create form exist |
| 7.2 | **Edit invoice** | No way to edit line items, amount, currency, or due date after creation |
| 7.3 | **Delete invoice** | No delete action |
| 7.4 | **Mark as paid** | `PATCH /api/admin/invoices/[id]` exists but there is no UI button on the list or a detail page |
| 7.5 | **Send invoice to client by email** | No "Send invoice" action that emails the client a link to the portal invoice page |
| 7.6 | **Invoice status filter** | List shows all invoices with no filter by status (unpaid / overdue / paid) |
| 7.7 | **Overdue detection** | No automatic flag or cron logic to flip `status` from `unpaid` → `overdue` when past due date |
| 7.8 | **Partial payment** | `partial` status exists in schema but is unused |

---

## 8. Admin — Settings

| # | Feature | Notes |
|---|---------|-------|
| 8.1 | **Change own password** | No UI for the logged-in admin to change their password |
| 8.2 | **Edit admin profile** | Cannot update own name or email |
| 8.3 | **Edit other admin's details** | Super admin cannot update another admin's name/email/role |
| 8.4 | **Delete admin** | Only enable/disable; no permanent removal |
| 8.5 | **Company / branding settings** | No settings for company name, logo, primary colour — all hardcoded |
| 8.6 | **Email notification settings** | No way to configure which events trigger email alerts to admins |
| 8.7 | **SMTP / email sender config** | Sender address (`noreply@cirostack.com`) is hardcoded in `send-otp` route |

---

## 9. Client Portal — General

| # | Feature | Notes |
|---|---------|-------|
| 9.1 | **`SessionProvider` for portal** [bug] | `PortalSettingsPage` calls `useSession()` from `next-auth/react` but there is no `SessionProvider` wrapping the portal with `basePath="/api/auth-client"`. The session will always be `null` on that page |
| 9.2 | **Portal projects list page** | There is no `/portal/projects` page — projects are only accessible via the dashboard cards or direct URL. Needs a dedicated projects list |
| 9.3 | **Paystack webhook handler** [partial] | `POST /api/portal/invoices/[id]/pay` initialises the transaction and there is a `/portal/invoices/[id]/success` page, but there is no **webhook endpoint** to receive Paystack's async `charge.success` event and mark the invoice as paid in the DB |
| 9.4 | **Mobile responsiveness — portal invoice summary** | `/portal/invoices` uses `grid-cols-3` for the summary stat cards — breaks on small screens |
| 9.5 | **Mobile responsiveness — portal invoice detail** | Line items table has no mobile card fallback |

---

## 10. Client Portal — Dashboard

| # | Feature | Notes |
|---|---------|-------|
| 10.1 | **Recent activity feed** | No recent updates or activity visible on the dashboard beyond unpaid invoices |
| 10.2 | **Quick actions** | No shortcuts to common tasks (pay outstanding invoice, download latest file, etc.) |

---

## 11. Client Portal — Projects

| # | Feature | Notes |
|---|---------|-------|
| 11.1 | **Projects list page** | Missing entirely (see 9.2) |
| 11.2 | **Client file upload** | Client cannot upload files to a project — only admins can |
| 11.3 | **Client comments on updates** | Client can read updates but cannot respond or ask questions |

---

## 12. Client Portal — Invoices

| # | Feature | Notes |
|---|---------|-------|
| 12.1 | **Paystack webhook** | See 9.3 — invoice is never automatically marked paid |
| 12.2 | **Payment success page** | `/portal/invoices/[id]/success` page exists in the directory but content is unknown; should confirm payment and show updated status |
| 12.3 | **PDF generation** | `GET /api/portal/invoices/[id]/pdf` route exists but implementation must be verified — if using a `pdf` library that isn't installed this will 500 |

---

## 13. Client Portal — Settings

| # | Feature | Notes |
|---|---------|-------|
| 13.1 | **Session reads null** [bug] | `useSession()` used without a matching `SessionProvider`; name never populates from session on first load |
| 13.2 | **Avatar upload** | `avatarUrl` in schema but no upload UI |
| 13.3 | **Change email** | No OTP-verified email change flow |
| 13.4 | **Notification preferences** | `PushPermissionBanner` exists but there is no per-event preference control |

---

## 14. Cross-Cutting

| # | Feature | Notes |
|---|---------|-------|
| 14.1 | **Email notifications to admin on new submission/lead/conversation** | No outbound email alerts when a new form submission, lead, or chat starts |
| 14.2 | **Email notifications to client on new invoice / project update** | No automated emails; only push notifications wired (and only for milestone completion) |
| 14.3 | **Role-based access control in admin UI** | All admin roles see identical UI; super-admin-only features (create admin, disable admin) should be hidden for `agent` role |
| 14.4 | **Search across admin** | No global search |
| 14.5 | **Audit log** | No history of who changed what in projects, invoices, or client records |
| 14.6 | **File storage** | Project files are uploaded to the local filesystem (`/public/uploads`); will not persist on serverless/ephemeral hosts (Vercel). Needs cloud storage (S3, Cloudinary, R2) |
| 14.7 | **CMS image storage** | Same issue — blog images written to `/public/uploads/blog` |
| 14.8 | **Rate limiting scope** | Current rate limiter only covers `/api/contact`. OTP send endpoint and admin login have no rate limiting |
| 14.9 | **Error boundaries** | No error boundary UI anywhere; unhandled fetch errors leave pages blank or broken silently |
