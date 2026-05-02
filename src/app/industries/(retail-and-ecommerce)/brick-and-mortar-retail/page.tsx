import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "brick-and-mortar-retail";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/brick-and-mortar-retail` },
  openGraph: {
    url: `https://cirostack.com/industries/brick-and-mortar-retail`,
    title: "Custom Software for Brick & Mortar Retail | CiroStack",
    description: "Our team builds POS integrations, loyalty program platforms, and foot traffic analytics dashboards for brick-and-mortar retailers bridging the gap between physical and digital.",
    images: [{ url: "https://cirostack.com/og/industry-pages/brick-and-mortar-retail.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/brick-and-mortar-retail.jpg"],
  },
};

export default function BrickAndMortarRetailPage() {
  return <Industry />;
}
