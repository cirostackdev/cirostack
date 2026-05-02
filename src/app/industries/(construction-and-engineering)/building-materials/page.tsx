import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "building-materials";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/building-materials` },
  openGraph: {
    url: `https://cirostack.com/industries/building-materials`,
    title: "Custom Software for Building Materials — CiroStack",
    description: "Our senior engineers build inventory management systems, contractor ordering portals, and delivery route planners that help building materials suppliers move product faster and reduce waste.",
    images: [{ url: "https://cirostack.com/og/industry-pages/building-materials.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/building-materials.jpg"],
  },
};

export default function BuildingMaterialsPage() {
  return <Industry />;
}
