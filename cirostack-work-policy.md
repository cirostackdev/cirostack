# CiroStack Work Policy

> **Effective**: June 2026
> **Applies to**: All CiroStack team members, contractors, and collaborators
> **Owner**: Jessy Onah, Founder

---

## 1. How We Work

CiroStack is remote-first. No office. No mandatory hours. What matters: the work ships on time, meets quality standards, and the client never has to chase you.

### Core Principles

- **Ownership over attendance.** You own your deliverables. Nobody tracks your hours, but everybody sees your output.
- **Ship, don't sit.** If you're blocked, say so immediately. Waiting silently is the worst thing you can do.
- **Fixed scope, fixed price.** Our business model depends on accurate scoping and efficient execution. Every hour wasted is our margin lost.

---

## 2. Work Hours and Availability

### Overlap Window

All team members must be available during the **overlap window**: **10:00 AM to 2:00 PM WAT (West Africa Time)**, Monday through Friday. This is when synchronous communication happens: standups, client calls, pair sessions.

Outside the overlap window, work when you're most productive. We don't care if that's 6 AM or midnight.

### Response Times

| Channel | Expected Response |
|---------|-------------------|
| Slack (direct message) | Within 2 hours during overlap window |
| Slack (channel mention) | Within 4 hours |
| Email | Within 24 hours |
| Client-facing thread | Within 4 hours during business hours |
| Urgent/production issue | Within 30 minutes (on-call rotation) |

If you'll be unavailable during the overlap window, post in #availability the day before.

### Time Off

- **Planned leave**: 48 hours notice minimum. Ensure your active tasks are handed off or paused.
- **Sick/emergency leave**: Message your project lead as soon as possible. No questions asked, no guilt.
- **Public holidays**: Observe your local holidays. Notify the team in advance.

---

## 3. Communication Standards

### Default to Async

Write it down. Most communication should be async: documented, searchable, and clear without follow-up questions. A good async message includes context, the decision or question, and what you need from the reader.

### Meetings

- Every meeting has an agenda shared 1 hour before.
- No meeting longer than 30 minutes without explicit justification.
- Meetings end with written action items posted in Slack.
- If it can be resolved in a Slack thread, it's not a meeting.

### Daily Standups

Post in your project channel by 10:30 AM WAT:

```
Done: [what you shipped yesterday]
Today: [what you're working on]
Blocked: [anything stopping progress, or "clear"]
```

Keep it under 5 lines. This isn't a diary.

### Client Communication

- **Never surprise the client.** If something is off-track, they hear it from us first.
- **Weekly updates minimum.** Even if the update is "on track, no blockers."
- **Use plain language.** No jargon. No "we're refactoring the service layer." Say "we're fixing the checkout flow so it handles edge cases properly."
- **Set expectations, then beat them.** Under-promise on timelines, over-deliver on quality.

---

## 4. Project Delivery Standards

### The Stack Process

Every project follows this lifecycle: **Ideate, Build, Improve, Operate, Scale.** Your work at any stage must meet these standards:

### Code Quality

- All code is reviewed before merge. No exceptions.
- Write tests for business logic. Minimum 80% coverage on critical paths.
- No code ships without passing CI. If CI is broken, fixing it is priority zero.
- Follow the project's established patterns. Consistency beats cleverness.
- Document "why," not "what." The code shows what it does. Comments explain decisions.

### Delivery

- Every task has a clear definition of done before work starts.
- Estimate in days, not hours. Pad by 20% for unknowns.
- If a task will take longer than estimated, flag it the moment you know. Not the day it's due.
- Deploy to staging before production. Always.
- Production deployments happen during business hours only (unless hotfix).

### Definition of Done

A feature is done when:

1. Code is written, reviewed, and merged
2. Tests pass in CI
3. Deployed to staging and manually verified
4. Documentation updated (if user-facing)
5. Client notified (if visible to them)

---

## 5. Security and Confidentiality

### Non-Negotiables

- **Never commit secrets.** No API keys, passwords, or tokens in code. Use environment variables and vault services.
- **Client data is sacred.** Never share client code, credentials, or business information outside the team assigned to that project.
- **Use 2FA on everything.** GitHub, Slack, email, cloud providers. No exceptions.
- **Lock your machine.** Leaving your laptop unlocked in a public space is a fireable offense.
- **Personal devices must be encrypted.** Full-disk encryption enabled on any device used for CiroStack work.

### Access Control

- You only have access to projects you're actively working on.
- When a project ends, your access is revoked within 48 hours.
- Never share credentials over Slack or email. Use the designated secrets manager.
- Report suspected breaches immediately to the founder. No delay, no shame.

---

## 6. Quality of Work

### What "Senior" Means Here

CiroStack promises clients senior engineering quality. That means:

- You consider edge cases before they become bugs.
- You think about the next developer who'll read your code.
- You push back on bad requirements instead of building the wrong thing perfectly.
- You understand the business context, not just the technical spec.
- You ask questions early, not after you've built the wrong thing.

### Accountability

- If you break production, you own the fix. No finger-pointing.
- If you miss a deadline, you own the communication. Tell the team and the client what happened and what's being done.
- If you don't understand a requirement, ask before building. "I assumed" is not acceptable.

---

## 7. Tools and Systems

### Required Stack

| Purpose | Tool |
|---------|------|
| Communication | Slack |
| Project management | Linear |
| Code hosting | GitHub |
| Design handoff | Figma |
| Documentation | Notion / project README |
| Secrets management | Vault / .env (never committed) |
| Deployments | Vercel / AWS (project-dependent) |
| Time tracking | Not required (we're fixed-price) |

### Git Standards

- Branch naming: `feature/short-description`, `fix/short-description`, `hotfix/short-description`
- Commit messages: imperative mood, under 72 characters. "Add payment webhook handler" not "added stuff"
- PRs: include context, screenshots (if UI), and testing steps
- Main branch is always deployable. If it's not, everything stops until it is.

---

## 8. Professional Conduct

### With Clients

- Be honest about what's possible and what isn't.
- Never agree to a timeline you know is unrealistic just to win work.
- Treat every client's business like it matters, because it does.
- Disagreements are fine. Disrespect is not.

### With the Team

- Give feedback on work, not on people.
- Code reviews are collaborative, not adversarial. "Have you considered..." not "this is wrong."
- Help when you can. Ask for help when you need it.
- No ego. The best idea wins, regardless of who said it.

### Zero Tolerance

The following result in immediate termination:

- Sharing client data or code without authorization
- Fabricating work or timesheets
- Harassment, discrimination, or bullying of any kind
- Deliberate sabotage of code, systems, or relationships
- Working on competing projects without disclosure

---

## 9. Growth and Development

### Learning Time

You are encouraged to spend up to 4 hours per week on professional development: courses, open source, writing, experimentation. This isn't tracked or mandated, but stagnation isn't acceptable either.

### Feedback

- You'll receive direct feedback on your work regularly. Don't take it personally.
- You're expected to give feedback too. If something isn't working (process, tools, communication), say so.
- Quarterly check-ins with the founder to discuss trajectory, satisfaction, and growth.

---

## 10. Compensation and Invoicing

### For Contractors

- Invoice on the 1st and 15th of each month (or as agreed in your contract).
- Payment processed within 7 business days of invoice receipt.
- Include project name, deliverables completed, and agreed rate on every invoice.
- Disputes are resolved within 48 hours of flagging.

### Performance and Pay

- Pay is tied to role, scope, and output. Not hours.
- Rate reviews happen every 6 months or at project completion (whichever is sooner).
- Exceptional work is recognized and compensated. We don't pretend "exposure" is payment.

---

## 11. Leaving CiroStack

### Offboarding

- 2 weeks notice minimum (or as per contract).
- Complete knowledge transfer: document anything in your head that isn't in the codebase.
- Return or destroy any client materials on personal devices.
- Access revoked on last day. No hard feelings.

### Non-Compete

There is no non-compete. Build whatever you want after you leave. But:

- Don't take client relationships you built here and pitch them competing services for 6 months.
- Don't use proprietary CiroStack tooling (Armory, internal agents) outside of CiroStack without permission.
- Don't share internal processes, pricing models, or strategies with competitors.

---

## Summary

This policy exists so everyone knows what's expected. It's not about control. It's about building something worth being proud of, with people who give a damn.

Do great work. Communicate clearly. Ship on time. Treat people well.

Everything else is details.

---

*Questions about this policy? Message Jessy directly. Updates will be communicated in #team-announcements.*
