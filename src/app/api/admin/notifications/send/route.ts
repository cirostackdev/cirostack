import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createNotification } from "@/lib/notify";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { clientId, title, body, href } = await req.json();

    if (!clientId || !title || !body) {
      return NextResponse.json({ error: "clientId, title, and body are required" }, { status: 400 });
    }

    // createNotification automatically triggers push notification
    const notification = await createNotification(clientId, title, body, href || undefined);

    return NextResponse.json({ notification }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/notifications/send]", err);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
