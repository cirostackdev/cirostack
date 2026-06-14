import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed Canned Responses
  const responses = [
    { title: "Greeting", shortcut: "hi", content: "Hello! Thanks for reaching out. How can I help you today?", category: "General" },
    { title: "Thank you", shortcut: "thanks", content: "Thank you for your message! Is there anything else I can help you with?", category: "General" },
    { title: "Hold on", shortcut: "hold", content: "Let me look into that for you. I'll be right back with an answer.", category: "General" },
    { title: "Goodbye", shortcut: "bye", content: "Thanks for chatting with us! Don't hesitate to reach out if you need anything else. Have a great day!", category: "General" },
    { title: "Out of office", shortcut: "ooo", content: "Thanks for your message! I'm currently out of office but will get back to you within 24 hours. If it's urgent, please mention it and a team member will assist you.", category: "General" },
    { title: "Project inquiry", shortcut: "project", content: "I'd love to learn more about your project! Could you share a few details?\n\n1. What type of project is it? (web app, mobile, design, etc.)\n2. Do you have a timeline in mind?\n3. Any specific features or requirements?", category: "Sales" },
    { title: "Pricing info", shortcut: "price", content: "Our pricing depends on the scope and complexity of the project. I'd be happy to provide a custom quote after learning more about your needs. Would you like to schedule a quick call to discuss?", category: "Sales" },
    { title: "Schedule call", shortcut: "call", content: "I'd be happy to jump on a call! You can pick a time that works for you, or let me know your availability and I'll send a calendar invite.", category: "Sales" },
    { title: "Follow up", shortcut: "followup", content: "Hi! Just following up on our previous conversation. Do you have any questions or updates to share?", category: "Follow-up" },
    { title: "Invoice sent", shortcut: "inv", content: "I've just sent you an invoice. You can view and pay it through your client portal. Let me know if you have any questions about it!", category: "Billing" },
    { title: "Project update", shortcut: "update", content: "Quick update on your project — we've made good progress this week. I've posted the details in your project dashboard. Take a look and let me know if you have any feedback!", category: "Projects" },
    { title: "Technical issue", shortcut: "bug", content: "I'm sorry to hear you're experiencing an issue. Could you provide a bit more detail?\n\n- What were you trying to do?\n- What happened instead?\n- Any error messages or screenshots?\n\nThis will help us resolve it quickly.", category: "Support" },
  ];

  const existingResponses = await prisma.cannedResponse.count();
  if (existingResponses === 0) {
    await prisma.cannedResponse.createMany({ data: responses });
    console.log(`✓ Created ${responses.length} canned responses`);
  } else {
    console.log(`  Canned responses already exist (${existingResponses}), skipping`);
  }

  // Seed Tags
  const tags = [
    { name: "Urgent", color: "#ef4444" },
    { name: "VIP", color: "#eab308" },
    { name: "New Lead", color: "#22c55e" },
    { name: "Follow-up", color: "#f97316" },
    { name: "Bug Report", color: "#ec4899" },
    { name: "Feature Request", color: "#8b5cf6" },
    { name: "Billing", color: "#06b6d4" },
    { name: "Onboarding", color: "#3b82f6" },
  ];

  for (const tag of tags) {
    await prisma.conversationTag.upsert({
      where: { name: tag.name },
      create: tag,
      update: { color: tag.color },
    });
  }
  console.log(`✓ Upserted ${tags.length} conversation tags`);

  // Seed Knowledge Base articles
  const articles = [
    {
      title: "Getting Started",
      slug: "getting-started",
      category: "Getting Started",
      published: true,
      order: 1,
      content: `Welcome to our platform! Here's how to get started:

1. **Log in** to your client portal using the email invitation you received.
2. **Set a password** when prompted on first login.
3. **Explore your dashboard** — you'll see your projects, invoices, and messages.
4. **Start a conversation** if you have questions — our team typically responds within minutes.

Need help? Use the chat widget on any page to reach us instantly.`,
    },
    {
      title: "How Billing Works",
      slug: "how-billing-works",
      category: "Billing",
      published: true,
      order: 2,
      content: `We use milestone-based billing for most projects:

- **Invoices** are generated at project milestones or monthly.
- **Payment** is accepted via card through our secure portal (powered by Paystack).
- **Currencies**: We invoice in USD by default but can accommodate other currencies.
- **Due dates**: Standard net-15 terms unless otherwise agreed.

View all your invoices in the **Invoices** section of your portal. You can pay, download PDFs, or raise a dispute if something doesn't look right.`,
    },
    {
      title: "Project Milestones & Approvals",
      slug: "project-milestones",
      category: "Projects",
      published: true,
      order: 3,
      content: `Your projects are broken into milestones for transparency:

- Each milestone represents a deliverable or phase of work.
- You can **approve milestones** directly from your portal when you're satisfied.
- Post **comments and feedback** on any project to keep communication centralized.
- All project files and deliverables are available in the **Files** section.

Tip: Enable push notifications to get alerted when a milestone is ready for your review.`,
    },
    {
      title: "Managing Your Team",
      slug: "managing-team",
      category: "Account",
      published: true,
      order: 4,
      content: `You can invite team members to your portal account:

1. Go to **Settings** in your portal.
2. Scroll to the **Team Members** section.
3. Click **Invite** and enter their email address.
4. Choose their role: **Viewer** (read-only) or **Admin** (full access).

Team members will receive an email invitation to join your account.`,
    },
    {
      title: "Notification Settings",
      slug: "notification-settings",
      category: "Account",
      published: true,
      order: 5,
      content: `Control how you receive notifications:

1. Go to **Settings** > **Notification Preferences**.
2. Toggle push and email notifications per category:
   - Messages
   - Invoices & Payments
   - Project Updates
   - File Uploads
   - System Notifications

We recommend keeping push notifications on for Messages so you never miss a reply.`,
    },
    {
      title: "Disputing an Invoice",
      slug: "disputing-invoice",
      category: "Billing",
      published: true,
      order: 6,
      content: `If something doesn't look right on an invoice:

1. Open the invoice in your portal.
2. Click **Raise Dispute**.
3. Describe the issue — our team will review and respond promptly.

Disputes are tracked and resolved through the portal. You'll be notified when there's an update.`,
    },
  ];

  for (const article of articles) {
    await prisma.knowledgeArticle.upsert({
      where: { slug: article.slug },
      create: article,
      update: { title: article.title, content: article.content, category: article.category, published: article.published, order: article.order },
    });
  }
  console.log(`✓ Upserted ${articles.length} knowledge base articles`);

  // Seed default Automation rules
  const existingRules = await prisma.automationRule.count();
  if (existingRules === 0) {
    await prisma.automationRule.createMany({
      data: [
        {
          name: "Welcome message",
          trigger: "new-conversation",
          conditions: {},
          action: "send-message",
          actionData: { message: "Hi there! Thanks for reaching out. An agent will be with you shortly." },
          enabled: true,
          priority: 0,
        },
        {
          name: "Offline auto-reply",
          trigger: "offline",
          conditions: {},
          action: "send-message",
          actionData: { message: "We're currently offline but we've received your message. We'll get back to you as soon as we're back online!" },
          enabled: true,
          priority: 1,
        },
      ],
    });
    console.log("✓ Created 2 default automation rules");
  }

  await prisma.$disconnect();
  console.log("\nDone! Settings seeded successfully.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
