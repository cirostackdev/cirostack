import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "investment-firms";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/investment-firms` },
  openGraph: {
    url: `https://cirostack.com/industries/investment-firms`,
    title: "Custom Software for Investment Firms — CiroStack",
    description: "Our senior engineers build portfolio reporting tools, client relationship dashboards, and deal flow trackers that help investment firms make decisions and communicate results clearly.",
    images: [{ url: "https://cirostack.com/og/industry-pages/investment-firms.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/investment-firms.jpg"],
  },
};

export default function InvestmentFirmsPage() {
  return <Industry />;
}
