import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") ?? "30");
  const maxFirstResponseMinsParam = parseInt(searchParams.get("maxFirstResponseMins") ?? "0");

  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - days);

  // Get SLA config
  let maxFirstResponseMins = maxFirstResponseMinsParam;
  if (!maxFirstResponseMins) {
    const slaConfig = await prisma.sLAConfig.findFirst();
    maxFirstResponseMins = slaConfig?.maxFirstResponseMins ?? 15;
  }

  // Get conversations in the period that have a firstResponseAt
  const conversations = await prisma.conversation.findMany({
    where: {
      createdAt: { gte: from },
    },
    select: {
      id: true,
      createdAt: true,
      firstResponseAt: true,
      status: true,
    },
  });

  const totalConversations = conversations.length;
  const conversationsWithResponse = conversations.filter((c) => c.firstResponseAt);

  // Calculate average first response time
  let totalResponseMins = 0;
  let breaches = 0;

  for (const conv of conversationsWithResponse) {
    const responseTime = (new Date(conv.firstResponseAt!).getTime() - new Date(conv.createdAt).getTime()) / 60000;
    totalResponseMins += responseTime;
    if (responseTime > maxFirstResponseMins) {
      breaches++;
    }
  }

  // Also count conversations that never got a response and are older than the SLA threshold
  const noResponseBreaches = conversations.filter((c) => {
    if (c.firstResponseAt) return false;
    const ageMinutes = (now.getTime() - new Date(c.createdAt).getTime()) / 60000;
    return ageMinutes > maxFirstResponseMins;
  }).length;

  const totalBreaches = breaches + noResponseBreaches;
  const respondedCount = conversationsWithResponse.length;
  const avgFirstResponseMins = respondedCount > 0
    ? +(totalResponseMins / respondedCount).toFixed(1)
    : 0;

  // Compliance: conversations that were responded to within SLA / total conversations
  const withinSLA = respondedCount - breaches;
  const complianceRate = totalConversations > 0
    ? Math.round((withinSLA / totalConversations) * 100)
    : 0;

  return NextResponse.json({
    avgFirstResponseMins,
    complianceRate,
    breaches: totalBreaches,
    totalConversations,
  });
}
