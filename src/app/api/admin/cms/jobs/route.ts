import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const jobs = await prisma.job.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(jobs);
  } catch (err) {
    console.error("[GET /api/admin/cms/jobs]", err);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, department, type, location, description, body, active } = await req.json();

    if (!title || !department || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        title,
        department,
        type: type ?? "Full-Time",
        location: location ?? "Remote",
        description,
        body: body ?? null,
        active: active ?? true,
      },
    });
    return NextResponse.json(job, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/cms/jobs]", err);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
