import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "landscape-architecture";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/landscape-architecture` },
  openGraph: {
    url: `https://cirostack.com/industries/landscape-architecture`,
    title: "Custom Software for Landscape Architecture | CiroStack",
    description: "We build project visualization tools, plant specification databases, and client approval workflows that help landscape architecture firms present ideas and move projects forward quickly.",
    images: [{ url: "https://cirostack.com/og/industry-pages/landscape-architecture.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/landscape-architecture.jpg"],
  },
};

export default function LandscapeArchitecturePage() {
  return <Industry />;
}
