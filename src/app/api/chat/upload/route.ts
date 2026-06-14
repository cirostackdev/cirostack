import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

const MAX_SIZES: Record<string, number> = {
  image: 10 * 1024 * 1024,       // 10 MB
  video: 100 * 1024 * 1024,      // 100 MB
  audio: 20 * 1024 * 1024,       // 20 MB
  application: 10 * 1024 * 1024, // 10 MB
  text: 5 * 1024 * 1024,         // 5 MB
};

const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "video/mp4", "video/webm", "video/ogg", "video/quicktime",
  "audio/mpeg", "audio/mp4", "audio/ogg", "audio/wav", "audio/webm", "audio/aac",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "application/zip",
];

// Rate limiting: 10 uploads per IP per minute
const uploadRateMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = uploadRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    uploadRateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > 10;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many uploads. Try again later." }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Verify the upload belongs to a real, open conversation owned by this visitor
    const conversationId = formData.get("conversationId") as string | null;
    const visitorToken = formData.get("visitorToken") as string | null;
    if (!conversationId || !visitorToken) {
      return NextResponse.json({ error: "Missing conversation context" }, { status: 400 });
    }
    const conv = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { visitorToken: true, status: true },
    });
    if (!conv || conv.visitorToken !== visitorToken || conv.status !== "open") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "File type not supported" }, { status: 415 });
    }

    const category = file.type.split("/")[0];
    const maxSize = MAX_SIZES[category] ?? MAX_SIZES.application;
    if (file.size > maxSize) {
      const mb = Math.round(maxSize / 1024 / 1024);
      return NextResponse.json({ error: `File too large (max ${mb} MB for ${category})` }, { status: 413 });
    }

    const blob = await put(`chat/${Date.now()}-${file.name}`, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url, name: file.name, type: file.type, size: file.size });
  } catch (err) {
    console.error("[api/chat/upload POST]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
