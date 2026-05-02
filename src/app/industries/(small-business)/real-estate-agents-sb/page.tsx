import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "real-estate-agents-sb";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/real-estate-agents-sb` },
  openGraph: {
    url: `https://cirostack.com/industries/real-estate-agents-sb`,
    title: "Custom Software for Real Estate Agents | CiroStack",
    description: "CiroStack builds lead capture sites, automated follow-up tools, and property showcase pages for solo real estate agents who want to look polished and close faster.",
    images: [{ url: "https://cirostack.com/og/industry-pages/real-estate-agents-sb.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/real-estate-agents-sb.jpg"],
  },
};

export default function RealEstateAgentsSbPage() {
  return <Industry />;
}
