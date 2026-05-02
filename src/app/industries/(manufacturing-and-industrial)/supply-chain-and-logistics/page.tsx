import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "supply-chain-and-logistics";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/supply-chain-and-logistics` },
  openGraph: {
    url: `https://cirostack.com/industries/supply-chain-and-logistics`,
    title: "Custom Software for Supply Chain & Logistics — CiroStack",
    description: "We create end-to-end visibility platforms, demand forecasting tools, and carrier management systems for supply chain teams — built by senior engineers who understand the complexity.",
    images: [{ url: "https://cirostack.com/og/industry-pages/supply-chain-and-logistics.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/supply-chain-and-logistics.jpg"],
  },
};

export default function SupplyChainAndLogisticsPage() {
  return <Industry />;
}
