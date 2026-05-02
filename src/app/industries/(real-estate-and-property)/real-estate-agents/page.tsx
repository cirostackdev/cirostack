import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "real-estate-agents";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/real-estate-agents` },
  openGraph: {
    url: `https://cirostack.com/industries/real-estate-agents`,
    title: "Custom Software for Real Estate Agents — CiroStack",
    description: "CiroStack builds CRM systems, showing schedulers, and client follow-up automation tools for real estate agents who want to close more deals without more busywork.",
    images: [{ url: "https://cirostack.com/og/industry-pages/real-estate-agents.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/real-estate-agents.jpg"],
  },
};

export default function RealEstateAgentsPage() {
  return <Industry />;
}
