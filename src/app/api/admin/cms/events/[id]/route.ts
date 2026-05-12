import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const event = await prisma.event.update({ where: { id }, data: body });
    revalidatePath("/events");
    return NextResponse.json(event);
  } catch (err) {
    console.error("[PATCH /api/admin/cms/events/[id]]", err);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.event.delete({ where: { id } });
    revalidatePath("/events");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/cms/events/[id]]", err);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
