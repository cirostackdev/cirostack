import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "dance-studios";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/dance-studios` },
  openGraph: {
    url: `https://cirostack.com/industries/dance-studios`,
    title: "Custom Software for Dance Studios | CiroStack",
    description: "We build class registration systems, recital management tools, and student progress dashboards for dance studios, delivered by senior engineers who scope it right the first time.",
    images: [{ url: "https://cirostack.com/og/industry-pages/dance-studios.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/dance-studios.jpg"],
  },
};

export default function DanceStudiosPage() {
  return <Industry />;
}
