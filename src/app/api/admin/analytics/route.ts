import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const LEAD_STATUS_ORDER = ["new", "contacted", "qualified", "won", "lost"];

function getLeadStatus(tags: string[]) {
  return LEAD_STATUS_ORDER.find((s) => tags.includes(s)) ?? "new";
}

function toUsd(amount: number, usdRate: number) {
  return (amount / 100) * (usdRate ?? 1);
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") ?? "30");
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - days);

  const [
    submissions,
    leads,
    newClients,
    paidInvoices,
    unpaidInvoices,
    allPaidWithDates,
    projectsByStatus,
    overdueProjects,
    totalMilestones,
    completedMilestones,
    blogTotal, blogPub, blogFeat,
    portTotal, portPub, portFeat,
    jobTotal, jobActive,
    eventTotal, eventPub,
    resourceTotal, resourcePub,
    annoTotal, annoPub, annoFeat,
    convPeriod, convOpen, unreadMsgs,
  ] = await Promise.all([
    prisma.formSubmission.findMany({
      where: { createdAt: { gte: from } },
      select: { type: true, status: true, createdAt: true },
    }),
    prisma.lead.findMany({
      select: { tags: true, source: true, createdAt: true },
    }),
    prisma.client.count({ where: { createdAt: { gte: from } } }),
    prisma.invoice.findMany({
      where: { status: "paid", paidAt: { not: null } },
      select: {
        amount: true, usdRate: true, paidAt: true, createdAt: true,
        clientId: true, client: { select: { name: true, email: true } },
      },
    }),
    prisma.invoice.findMany({
      where: { status: { in: ["unpaid", "overdue"] } },
      select: { amount: true, usdRate: true, dueDate: true, createdAt: true },
    }),
    prisma.invoice.findMany({
      where: { status: "paid", paidAt: { not: null } },
      select: { createdAt: true, paidAt: true },
    }),
    prisma.project.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.project.findMany({
      where: { dueDate: { lt: now }, status: { notIn: ["complete"] } },
      select: { id: true, title: true, dueDate: true, status: true, client: { select: { name: true, email: true } } },
      orderBy: { dueDate: "asc" },
      take: 10,
    }),
    prisma.milestone.count(),
    prisma.milestone.count({ where: { completed: true } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.blogPost.count({ where: { featured: true } }),
    prisma.portfolioProject.count(),
    prisma.portfolioProject.count({ where: { published: true } }),
    prisma.portfolioProject.count({ where: { featured: true } }),
    prisma.job.count(),
    prisma.job.count({ where: { active: true } }),
    prisma.event.count(),
    prisma.event.count({ where: { published: true } }),
    prisma.resource.count(),
    prisma.resource.count({ where: { published: true } }),
    prisma.announcement.count(),
    prisma.announcement.count({ where: { published: true } }),
    prisma.announcement.count({ where: { featured: true } }),
    prisma.conversation.count({ where: { createdAt: { gte: from } } }),
    prisma.conversation.count({ where: { status: "open" } }),
    prisma.message.count({ where: { read: false, senderType: "visitor" } }),
  ]);

  // ── Pipeline ────────────────────────────────────────────────────────────────

  const periodLeads = leads.filter((l) => new Date(l.createdAt) >= from);
  const leadsByStatus: Record<string, number> = { new: 0, contacted: 0, qualified: 0, won: 0, lost: 0 };
  for (const l of leads) leadsByStatus[getLeadStatus(l.tags)]++;

  const sourceMap: Record<string, { total: number; won: number }> = {};
  for (const l of leads) {
    const src = l.source ?? "direct";
    if (!sourceMap[src]) sourceMap[src] = { total: 0, won: 0 };
    sourceMap[src].total++;
    if (l.tags.includes("won")) sourceMap[src].won++;
  }
  const leadSources = Object.entries(sourceMap)
    .map(([source, d]) => ({ source, ...d }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  const subsByType: Record<string, number> = {};
  const subsByStatus: Record<string, number> = { new: 0, reviewed: 0, actioned: 0 };
  for (const s of submissions) {
    subsByType[s.type] = (subsByType[s.type] ?? 0) + 1;
    subsByStatus[s.status] = (subsByStatus[s.status] ?? 0) + 1;
  }

  // ── Financial ───────────────────────────────────────────────────────────────

  const periodRevenue = paidInvoices
    .filter((i) => i.paidAt && new Date(i.paidAt) >= from)
    .reduce((s, i) => s + toUsd(i.amount, i.usdRate), 0);

  const monthly: { label: string; year: number; total: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const total = paidInvoices
      .filter((inv) => inv.paidAt && new Date(inv.paidAt) >= d && new Date(inv.paidAt) < end)
      .reduce((s, inv) => s + toUsd(inv.amount, inv.usdRate), 0);
    monthly.push({ label: d.toLocaleString("en-US", { month: "short" }), year: d.getFullYear(), total });
  }

  const aging = [
    { bucket: "< 7d", count: 0, amount: 0 },
    { bucket: "7–30d", count: 0, amount: 0 },
    { bucket: "30–60d", count: 0, amount: 0 },
    { bucket: "> 60d", count: 0, amount: 0 },
  ];
  for (const inv of unpaidInvoices) {
    const ref = inv.dueDate ? new Date(inv.dueDate) : new Date(inv.createdAt);
    const daysOld = Math.max(0, Math.floor((now.getTime() - ref.getTime()) / 86400000));
    const amt = toUsd(inv.amount, inv.usdRate);
    const bucket = daysOld < 7 ? 0 : daysOld < 30 ? 1 : daysOld < 60 ? 2 : 3;
    aging[bucket].count++;
    aging[bucket].amount += amt;
  }

  const payTimes = allPaidWithDates
    .filter((i) => i.paidAt)
    .map((i) => Math.floor((new Date(i.paidAt!).getTime() - new Date(i.createdAt).getTime()) / 86400000));
  const avgPaymentDays = payTimes.length ? Math.round(payTimes.reduce((a, b) => a + b, 0) / payTimes.length) : 0;

  const clientRevMap: Record<string, { name: string; email: string; total: number }> = {};
  for (const inv of paidInvoices) {
    if (!clientRevMap[inv.clientId]) clientRevMap[inv.clientId] = { name: inv.client.name ?? inv.client.email, email: inv.client.email, total: 0 };
    clientRevMap[inv.clientId].total += toUsd(inv.amount, inv.usdRate);
  }
  const topClients = Object.values(clientRevMap).sort((a, b) => b.total - a.total).slice(0, 8);
  const pipelineValue = unpaidInvoices.reduce((s, i) => s + toUsd(i.amount, i.usdRate), 0);

  // ── Projects ────────────────────────────────────────────────────────────────

  const overdueList = overdueProjects.map((p) => ({
    id: p.id,
    title: p.title,
    status: p.status,
    client: p.client.name ?? p.client.email,
    daysOverdue: p.dueDate
      ? Math.floor((now.getTime() - new Date(p.dueDate).getTime()) / 86400000)
      : null,
  }));

  const milestoneRate = totalMilestones > 0
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : 0;

  // ── KPIs ────────────────────────────────────────────────────────────────────

  const totalLeads = leads.length;
  const conversionRate = totalLeads > 0 ? Math.round((leadsByStatus.won / totalLeads) * 100) : 0;

  return NextResponse.json({
    meta: { days },
    kpis: {
      periodRevenue,
      periodLeads: periodLeads.length,
      conversionRate,
      newClients,
      overdueInvoices: unpaidInvoices.filter((i) => i.dueDate && new Date(i.dueDate) < now).length,
    },
    pipeline: {
      funnel: {
        submissions: submissions.length,
        leads: totalLeads,
        qualified: leadsByStatus.qualified + leadsByStatus.won,
        won: leadsByStatus.won,
      },
      leadsByStatus,
      leadSources,
      subsByType: Object.entries(subsByType).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count),
      subsByStatus,
    },
    financial: {
      periodRevenue,
      pipelineValue,
      avgPaymentDays,
      monthly,
      aging,
      topClients,
    },
    projects: {
      byStatus: projectsByStatus.map((p) => ({ status: p.status, count: p._count.id })),
      overdueList,
      milestones: { total: totalMilestones, completed: completedMilestones, rate: milestoneRate },
    },
    content: {
      blog: { total: blogTotal, published: blogPub, draft: blogTotal - blogPub, featured: blogFeat },
      portfolio: { total: portTotal, published: portPub, draft: portTotal - portPub, featured: portFeat },
      jobs: { total: jobTotal, active: jobActive, inactive: jobTotal - jobActive },
      events: { total: eventTotal, published: eventPub, draft: eventTotal - eventPub },
      resources: { total: resourceTotal, published: resourcePub, draft: resourceTotal - resourcePub },
      announcements: { total: annoTotal, published: annoPub, draft: annoTotal - annoPub, featured: annoFeat },
    },
    conversations: {
      periodTotal: convPeriod,
      openNow: convOpen,
      unreadMessages: unreadMsgs,
    },
  });
}
