import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/auth";

const MAX_SIZES: Record<string, number> = {
  image: 10 * 1024 * 1024,
  video: 100 * 1024 * 1024,
  audio: 20 * 1024 * 1024,
  application: 10 * 1024 * 1024,
  text: 5 * 1024 * 1024,
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

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "File type not supported" }, { status: 415 });
    }

    const category = file.type.split("/")[0];
    const maxSize = MAX_SIZES[category] ?? MAX_SIZES.application;
    if (file.size > maxSize) {
      const mb = Math.round(maxSize / 1024 / 1024);
      return NextResponse.json({ error: `File too large (max ${mb} MB for ${category})` }, { status: 413 });
    }

    const blob = await put(`chat/admin/${Date.now()}-${file.name}`, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url, name: file.name, type: file.type, size: file.size });
  } catch (err) {
    console.error("[admin/chat-upload POST]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
