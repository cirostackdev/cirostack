import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "auto-parts-stores";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/auto-parts-stores` },
  openGraph: {
    url: `https://cirostack.com/industries/auto-parts-stores`,
    title: "Custom Software for Auto Parts Stores | CiroStack",
    description: "We build parts catalog systems, inventory lookup tools, and point-of-sale integrations that help auto parts stores serve customers faster and manage stock with confidence.",
    images: [{ url: "https://cirostack.com/og/industry-pages/auto-parts-stores.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/auto-parts-stores.jpg"],
  },
};

export default function AutoPartsStoresPage() {
  return <Industry />;
}
