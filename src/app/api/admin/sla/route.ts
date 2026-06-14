import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let config = await prisma.sLAConfig.findFirst();
  if (!config) {
    config = await prisma.sLAConfig.create({
      data: { maxFirstResponseMins: 15, maxResolutionMins: 1440, breachNotify: true },
    });
  }

  return NextResponse.json(config);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { maxFirstResponseMins, maxResolutionMins, breachNotify } = body;

  let config = await prisma.sLAConfig.findFirst();
  if (!config) {
    config = await prisma.sLAConfig.create({
      data: {
        maxFirstResponseMins: maxFirstResponseMins ?? 15,
        maxResolutionMins: maxResolutionMins ?? 1440,
        breachNotify: breachNotify ?? true,
      },
    });
  } else {
    config = await prisma.sLAConfig.update({
      where: { id: config.id },
      data: {
        ...(maxFirstResponseMins !== undefined && { maxFirstResponseMins }),
        ...(maxResolutionMins !== undefined && { maxResolutionMins }),
        ...(breachNotify !== undefined && { breachNotify }),
      },
    });
  }

  return NextResponse.json(config);
}
