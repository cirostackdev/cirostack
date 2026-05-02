import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "federal-agencies";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/federal-agencies` },
  openGraph: {
    url: `https://cirostack.com/industries/federal-agencies`,
    title: "Custom Software for Federal Agencies — CiroStack",
    description: "Our senior engineers build case management systems, public-facing service portals, and internal workflow tools that help federal agencies serve citizens efficiently and meet compliance standards.",
    images: [{ url: "https://cirostack.com/og/industry-pages/federal-agencies.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/federal-agencies.jpg"],
  },
};

export default function FederalAgenciesPage() {
  return <Industry />;
}
