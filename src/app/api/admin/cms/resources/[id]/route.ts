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
    const resource = await prisma.resource.update({ where: { id }, data: body });
    revalidatePath("/resources");
    return NextResponse.json(resource);
  } catch (err) {
    console.error("[PATCH /api/admin/cms/resources/[id]]", err);
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.resource.delete({ where: { id } });
    revalidatePath("/resources");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/cms/resources/[id]]", err);
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}
