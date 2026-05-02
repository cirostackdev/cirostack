import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "manufacturing-plants";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/manufacturing-plants` },
  openGraph: {
    url: `https://cirostack.com/industries/manufacturing-plants`,
    title: "Custom Software for Manufacturing Plants — CiroStack",
    description: "CiroStack delivers shop floor management tools, shift scheduling systems, and output tracking dashboards built specifically for manufacturing plant operations and daily production goals.",
    images: [{ url: "https://cirostack.com/og/industry-pages/manufacturing-plants.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/manufacturing-plants.jpg"],
  },
};

export default function ManufacturingPlantsPage() {
  return <Industry />;
}
