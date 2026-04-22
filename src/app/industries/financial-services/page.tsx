import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Financial Services Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Financial Services industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/financial-services" },
  openGraph: {
    url: "https://cirostack.com/industries/financial-services",
    title: "Financial Services Software Solutions | CiroStack",
    description:
      "Custom software for the Financial Services industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/images/pages/hero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Financial Services" }],
  },
};

export default function FinancialServicesPage() {
  return <IndustryCategory categoryId="financial-services" />;
}
