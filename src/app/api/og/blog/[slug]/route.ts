import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const BADGE_SIZE = 90;
const LOGO_SIZE = 56;
const BADGE_X = 18;
const BADGE_Y = 18;

async function createBadge(): Promise<Buffer> {
  const logoPath = path.join(process.cwd(), "src/assets/logo.png");
  const logo = await sharp(logoPath)
    .resize(LOGO_SIZE, LOGO_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const r = BADGE_SIZE / 2;
  const circleSvg = Buffer.from(
    `<svg width="${BADGE_SIZE}" height="${BADGE_SIZE}"><circle cx="${r}" cy="${r}" r="${r}" fill="white"/></svg>`
  );

  const logoOffset = Math.round((BADGE_SIZE - LOGO_SIZE) / 2);
  return sharp(circleSvg)
    .composite([{ input: logo, left: logoOffset, top: logoOffset }])
    .png()
    .toBuffer();
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug, published: true },
      select: { imageUrl: true },
    });

    if (!post?.imageUrl) {
      const fallback = path.join(process.cwd(), "public/og/pages/blog.jpg");
      const buf = fs.readFileSync(fallback);
      return new NextResponse(buf, { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=86400, s-maxage=604800" } });
    }

    // If it's a local path, read from filesystem
    let imageBuffer: Buffer;
    if (post.imageUrl.startsWith("/")) {
      const localPath = path.join(process.cwd(), "public", post.imageUrl);
      if (!fs.existsSync(localPath)) {
        const fallback = path.join(process.cwd(), "public/og/pages/blog.jpg");
        const buf = fs.readFileSync(fallback);
        return new NextResponse(buf, { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=86400, s-maxage=604800" } });
      }
      imageBuffer = fs.readFileSync(localPath);
    } else {
      // Fetch remote image, request a smaller version if possible
      let imageUrl = post.imageUrl;
      if (imageUrl.includes("wp-content/uploads") && !imageUrl.includes("?w=")) {
        imageUrl += "?w=1200";
      }
      const res = await fetch(imageUrl);
      if (!res.ok) {
        const fallback = path.join(process.cwd(), "public/og/pages/blog.jpg");
        const buf = fs.readFileSync(fallback);
        return new NextResponse(buf, { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=86400, s-maxage=604800" } });
      }
      imageBuffer = Buffer.from(await res.arrayBuffer());
    }

    const badge = await createBadge();

    const og = await sharp(imageBuffer)
      .resize(OG_WIDTH, OG_HEIGHT, { fit: "cover", position: "center" })
      .composite([{ input: badge, left: BADGE_X, top: BADGE_Y }])
      .jpeg({ quality: 90 })
      .toBuffer();

    return new NextResponse(og, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    });
  } catch {
    const fallback = path.join(process.cwd(), "public/og/pages/blog.jpg");
    const buf = fs.readFileSync(fallback);
    return new NextResponse(buf, { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=86400" } });
  }
}
