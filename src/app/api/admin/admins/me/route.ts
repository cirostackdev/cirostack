import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  const session = await auth();
  const user = session?.user as any;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, currentPassword, newPassword } = await req.json();
    const updates: Record<string, unknown> = {};

    if (name) updates.name = name;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password required" }, { status: 400 });
      }
      const admin = await prisma.admin.findUnique({ where: { id: user.id } });
      if (!admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

      const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

      updates.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const updated = await prisma.admin.update({
      where: { id: user.id },
      data: updates,
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH /api/admin/admins/me]", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
