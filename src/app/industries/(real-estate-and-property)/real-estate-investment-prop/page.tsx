import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "real-estate-investment-prop";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/real-estate-investment-prop` },
  openGraph: {
    url: `https://cirostack.com/industries/real-estate-investment-prop`,
    title: "Custom Software for Real Estate Investment — CiroStack",
    description: "We build portfolio analytics dashboards, deal evaluation tools, and investor reporting platforms for real estate investment firms tracking returns across multiple properties.",
    images: [{ url: "https://cirostack.com/og/industry-pages/real-estate-investment-prop.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/real-estate-investment-prop.jpg"],
  },
};

export default function RealEstateInvestmentPropPage() {
  return <Industry />;
}
