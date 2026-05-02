import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "event-production";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/event-production` },
  openGraph: {
    url: `https://cirostack.com/industries/event-production`,
    title: "Custom Software for Event Production — CiroStack",
    description: "Our senior engineers build crew scheduling apps, vendor coordination platforms, and timeline management tools for event production companies handling complex logistics.",
    images: [{ url: "https://cirostack.com/og/industry-pages/event-production.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/event-production.jpg"],
  },
};

export default function EventProductionPage() {
  return <Industry />;
}
