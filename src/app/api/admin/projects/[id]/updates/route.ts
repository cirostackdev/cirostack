import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sendPush } from "@/lib/push";
import { createNotification } from "@/lib/notify";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const { body, internal } = await req.json();
    if (!body) return NextResponse.json({ error: "body required" }, { status: 400 });

    const project = await prisma.project.findUnique({
      where: { id },
      select: { clientId: true, title: true },
    });
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const update = await prisma.projectUpdate.create({
      data: {
        projectId: id,
        authorId: (session.user as any).id,
        body,
        internal: internal ?? false,
      },
    });

    // Notify client if not internal
    if (!internal) {
      sendPush("client", project.clientId, {
        title: "New project update",
        body: `${project.title}: ${body.slice(0, 100)}`,
        url: `/portal/projects/${id}`,
      }).catch(console.error);
      createNotification(project.clientId, "New project update", `${project.title}: ${body.slice(0, 100)}`, `/portal/projects/${id}`).catch(console.error);
    }

    return NextResponse.json(update, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/projects/[id]/updates]", err);
    return NextResponse.json({ error: "Failed to post update" }, { status: 500 });
  }
}
