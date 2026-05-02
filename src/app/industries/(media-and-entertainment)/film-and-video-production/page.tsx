import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "film-and-video-production";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/film-and-video-production` },
  openGraph: {
    url: `https://cirostack.com/industries/film-and-video-production`,
    title: "Custom Software for Film & Video Production | CiroStack",
    description: "We create call sheet generators, asset management systems, and project tracking dashboards for production studios that need to keep shoots organized and on budget.",
    images: [{ url: "https://cirostack.com/og/industry-pages/film-and-video-production.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/film-and-video-production.jpg"],
  },
};

export default function FilmAndVideoProductionPage() {
  return <Industry />;
}
