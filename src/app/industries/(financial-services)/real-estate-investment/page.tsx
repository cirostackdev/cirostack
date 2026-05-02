import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "real-estate-investment";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/real-estate-investment` },
  openGraph: {
    url: `https://cirostack.com/industries/real-estate-investment`,
    title: "Custom Software for Real Estate Investment — CiroStack",
    description: "Our team builds deal analysis tools, investor portals, and property performance dashboards that help real estate investment firms track returns and communicate with stakeholders.",
    images: [{ url: "https://cirostack.com/og/industry-pages/real-estate-investment.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/real-estate-investment.jpg"],
  },
};

export default function RealEstateInvestmentPage() {
  return <Industry />;
}
