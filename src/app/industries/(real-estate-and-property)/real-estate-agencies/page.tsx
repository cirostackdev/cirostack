import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "real-estate-agencies";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/real-estate-agencies` },
  openGraph: {
    url: `https://cirostack.com/industries/real-estate-agencies`,
    title: "Custom Software for Real Estate Agencies | CiroStack",
    description: "We build listing management platforms, lead tracking tools, and agent performance dashboards for real estate agencies that want their own branded technology stack.",
    images: [{ url: "https://cirostack.com/og/industry-pages/real-estate-agencies.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/real-estate-agencies.jpg"],
  },
};

export default function RealEstateAgenciesPage() {
  return <Industry />;
}
