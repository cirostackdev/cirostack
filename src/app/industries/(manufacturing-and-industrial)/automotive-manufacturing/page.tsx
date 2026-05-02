import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "automotive-manufacturing";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/automotive-manufacturing` },
  openGraph: {
    url: `https://cirostack.com/industries/automotive-manufacturing`,
    title: "Custom Software for Automotive Manufacturing | CiroStack",
    description: "We build production tracking dashboards, assembly line monitoring tools, and inventory systems for automotive manufacturers, delivered by senior engineers at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/automotive-manufacturing.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/automotive-manufacturing.jpg"],
  },
};

export default function AutomotiveManufacturingPage() {
  return <Industry />;
}
