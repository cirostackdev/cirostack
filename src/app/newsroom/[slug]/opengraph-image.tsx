import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const alt = "CiroStack Newsroom";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let title = "CiroStack Newsroom";
  let source = "";
  let image: string | null = null;

  try {
    const article = await prisma.newsArticle.findUnique({
      where: { slug },
      select: { title: true, source: true, image: true },
    });
    if (article) {
      title = article.title;
      source = article.source;
      image = article.image;
    }
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0a0a0a",
        }}
      >
        {/* Background image with overlay */}
        {image && (
          <img
            src={image}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.4,
            }}
          />
        )}

        {/* Dark gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {/* Top: Logo badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: 800,
                color: "#0a0a0a",
              }}
            >
              C
            </div>
            <span style={{ color: "white", fontSize: "24px", fontWeight: 700 }}>
              CiroStack
            </span>
          </div>

          {/* Bottom: Title and source */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {source && (
              <span
                style={{
                  color: "#6366f1",
                  fontSize: "18px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {source}
              </span>
            )}
            <h1
              style={{
                color: "white",
                fontSize: title.length > 80 ? "36px" : "44px",
                fontWeight: 700,
                lineHeight: 1.2,
                margin: 0,
                maxWidth: "900px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </h1>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px" }}>
              cirostack.com/newsroom
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
