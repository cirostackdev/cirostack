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

  const ratings = await prisma.cSATRating.findMany({
    where: { createdAt: { gte: from } },
    include: {
      conversation: {
        select: { id: true, visitorName: true, visitorEmail: true, topic: true, assignedTo: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate metrics
  const totalRatings = ratings.length;
  const avgRating = totalRatings > 0
    ? +(ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(2)
    : 0;

  const distribution = [0, 0, 0, 0, 0]; // index 0 = rating 1, index 4 = rating 5
  for (const r of ratings) {
    distribution[r.rating - 1]++;
  }

  const recentFeedback = ratings
    .filter((r) => r.feedback)
    .slice(0, 10)
    .map((r) => ({
      id: r.id,
      rating: r.rating,
      feedback: r.feedback,
      visitorName: r.conversation.visitorName,
      topic: r.conversation.topic,
      agent: r.conversation.assignedTo?.name ?? null,
      createdAt: r.createdAt,
    }));

  return NextResponse.json({
    totalRatings,
    avgRating,
    distribution,
    recentFeedback,
    ratings: ratings.map((r) => ({
      id: r.id,
      rating: r.rating,
      feedback: r.feedback,
      conversationId: r.conversationId,
      visitorName: r.conversation.visitorName,
      topic: r.conversation.topic,
      agent: r.conversation.assignedTo?.name ?? null,
      createdAt: r.createdAt,
    })),
  });
}
