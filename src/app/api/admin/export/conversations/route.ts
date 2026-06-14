import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const format = req.nextUrl.searchParams.get("format") || "csv";
  const idsParam = req.nextUrl.searchParams.get("ids");

  const where = idsParam && idsParam !== "all" ? { id: { in: idsParam.split(",") } } : {};

  const conversations = await prisma.conversation.findMany({
    where,
    include: { messages: { orderBy: { createdAt: "asc" } }, _count: { select: { messages: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (format === "txt") {
    const lines = conversations.map((c) => {
      const header = `=== ${c.visitorName || "Anonymous"} (${c.visitorEmail || "N/A"}) — ${c.topic || "No topic"} — ${c.status} ===\n`;
      const msgs = c.messages.map((m) => `[${new Date(m.createdAt).toISOString()}] ${m.senderType === "agent" ? "Agent" : "Visitor"}: ${m.body}`).join("\n");
      return header + msgs;
    }).join("\n\n");

    return new NextResponse(lines, { headers: { "Content-Type": "text/plain", "Content-Disposition": "attachment; filename=conversations.txt" } });
  }

  // CSV
  const header = "ID,Visitor Name,Email,Topic,Status,Messages,Created\n";
  const rows = conversations.map((c) =>
    `"${c.id}","${c.visitorName || ""}","${c.visitorEmail || ""}","${c.topic || ""}","${c.status}",${c._count.messages},"${c.createdAt.toISOString()}"`
  ).join("\n");

  return new NextResponse(header + rows, { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=conversations.csv" } });
}
