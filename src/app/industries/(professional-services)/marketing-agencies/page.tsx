import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "marketing-agencies";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/marketing-agencies` },
  openGraph: {
    url: `https://cirostack.com/industries/marketing-agencies`,
    title: "Custom Software for Marketing Agencies | CiroStack",
    description: "We create campaign dashboards, client reporting portals, and project management tools for marketing agencies tired of stitching together five different SaaS subscriptions.",
    images: [{ url: "https://cirostack.com/og/industry-pages/marketing-agencies.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/marketing-agencies.jpg"],
  },
};

export default function MarketingAgenciesPage() {
  return <Industry />;
}
