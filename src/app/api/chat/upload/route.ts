import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];

// Rate limiting: 10 uploads per IP per minute.
// No session auth here because this endpoint serves the visitor chat widget
// where users are anonymous (not logged in).
const uploadRateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = uploadRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    uploadRateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  if (entry.count > 10) return true;
  return false;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many uploads. Try again later." }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 413 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: images, PDF" },
        { status: 415 }
      );
    }

    const ext = file.name.split(".").pop() || "bin";
    const filename = `${crypto.randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "chat");

    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/chat/${filename}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error("[api/chat/upload POST]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
