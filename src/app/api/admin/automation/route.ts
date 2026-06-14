import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rules = await prisma.automationRule.findMany({ orderBy: { priority: "asc" } });
  return NextResponse.json(rules);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, trigger, conditions, action, actionData, enabled, priority } = await req.json();
  if (!name || !trigger || !action) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const rule = await prisma.automationRule.create({
    data: { name, trigger, conditions: conditions || {}, action, actionData: actionData || {}, enabled: enabled ?? true, priority: priority ?? 0 },
  });

  return NextResponse.json(rule, { status: 201 });
}
