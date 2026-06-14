import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();

  const rule = await prisma.automationRule.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.trigger && { trigger: data.trigger }),
      ...(data.conditions !== undefined && { conditions: data.conditions }),
      ...(data.action && { action: data.action }),
      ...(data.actionData !== undefined && { actionData: data.actionData }),
      ...(data.enabled !== undefined && { enabled: data.enabled }),
      ...(data.priority !== undefined && { priority: data.priority }),
    },
  });

  return NextResponse.json(rule);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.automationRule.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
