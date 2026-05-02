import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "sports-events";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/sports-events` },
  openGraph: {
    url: `https://cirostack.com/industries/sports-events`,
    title: "Custom Software for Sports Events | CiroStack",
    description: "We build registration portals, heat and bracket management tools, and live results dashboards for sports events that need everything to run on time and without confusion.",
    images: [{ url: "https://cirostack.com/og/industry-pages/sports-events.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/sports-events.jpg"],
  },
};

export default function SportsEventsPage() {
  return <Industry />;
}
