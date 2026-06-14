import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let config = await prisma.widgetConfig.findFirst();
  if (!config) {
    config = await prisma.widgetConfig.create({ data: {} });
  }

  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  let config = await prisma.widgetConfig.findFirst();

  if (config) {
    config = await prisma.widgetConfig.update({
      where: { id: config.id },
      data: {
        primaryColor: data.primaryColor,
        position: data.position,
        welcomeMessage: data.welcomeMessage,
        offlineMessage: data.offlineMessage,
        preChatForm: data.preChatForm,
        preChatFields: data.preChatFields,
        showBranding: data.showBranding,
        autoOpenDelay: data.autoOpenDelay,
      },
    });
  } else {
    config = await prisma.widgetConfig.create({ data });
  }

  return NextResponse.json(config);
}
