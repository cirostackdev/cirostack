import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "organic-farming";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/organic-farming` },
  openGraph: {
    url: `https://cirostack.com/industries/organic-farming`,
    title: "Custom Software for Organic Farming — CiroStack",
    description: "Certification tracking, soil health dashboards, and direct-to-consumer ordering platforms — we build software that helps organic farms grow and prove their standards at every step.",
    images: [{ url: "https://cirostack.com/og/industry-pages/organic-farming.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/organic-farming.jpg"],
  },
};

export default function OrganicFarmingPage() {
  return <Industry />;
}
