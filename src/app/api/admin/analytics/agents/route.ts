import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") ?? "30");
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - days);

  // Get all agents
  const agents = await prisma.admin.findMany({
    where: { disabled: false },
    select: { id: true, name: true, email: true, role: true, online: true },
  });

  // Get conversations assigned in the period
  const conversations = await prisma.conversation.findMany({
    where: {
      assignedToId: { not: null },
      createdAt: { gte: from },
    },
    select: {
      id: true,
      assignedToId: true,
      firstResponseAt: true,
      createdAt: true,
      updatedAt: true,
      status: true,
    },
  });

  // Get messages sent by agents in the period
  const agentMessages = await prisma.message.findMany({
    where: {
      senderType: "agent",
      createdAt: { gte: from },
    },
    select: { senderId: true, conversationId: true, createdAt: true },
  });

  // Calculate per-agent stats
  const agentStats = agents.map((agent) => {
    const agentConversations = conversations.filter((c) => c.assignedToId === agent.id);
    const agentMsgs = agentMessages.filter((m) => m.senderId === agent.id);

    // Average first response time (in minutes)
    const responseTimes = agentConversations
      .filter((c) => c.firstResponseAt)
      .map((c) => {
        const diff = new Date(c.firstResponseAt!).getTime() - new Date(c.createdAt).getTime();
        return diff / 60000; // convert to minutes
      });
    const avgFirstResponseMins = responseTimes.length > 0
      ? +(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1)
      : 0;

    // Average conversation duration (from creation to last update, in hours)
    const closedConversations = agentConversations.filter((c) => c.status === "closed");
    const durations = closedConversations.map((c) => {
      const diff = new Date(c.updatedAt).getTime() - new Date(c.createdAt).getTime();
      return diff / 3600000; // convert to hours
    });
    const avgDurationHours = durations.length > 0
      ? +(durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1)
      : 0;

    return {
      id: agent.id,
      name: agent.name,
      email: agent.email,
      role: agent.role,
      online: agent.online,
      totalConversations: agentConversations.length,
      avgFirstResponseMins,
      totalMessagesSent: agentMsgs.length,
      avgDurationHours,
    };
  });

  // Sort by conversations handled descending
  agentStats.sort((a, b) => b.totalConversations - a.totalConversations);

  return NextResponse.json({ agents: agentStats });
}
