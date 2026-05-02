import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "motorcycle-shops";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/motorcycle-shops` },
  openGraph: {
    url: `https://cirostack.com/industries/motorcycle-shops`,
    title: "Custom Software for Motorcycle Shops | CiroStack",
    description: "Our senior engineers build parts inventory systems, service ticket workflows, and online storefronts that help motorcycle shops sell more and wrench smarter.",
    images: [{ url: "https://cirostack.com/og/industry-pages/motorcycle-shops.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/motorcycle-shops.jpg"],
  },
};

export default function MotorcycleShopsPage() {
  return <Industry />;
}
