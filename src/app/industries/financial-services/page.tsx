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
    images: [{ url: "https://cirostack.com/api/og?title=Financial%20Services%20Software%20Solutions%20%7C%20CiroStack&description=Custom%20software%20for%20the%20Financial%20Services%20industry.%20Fixed-price.%20Senior%20engineers.%20Shipped%20in%20weeks.&label=Industries", width: 1200, height: 630, alt: "CiroStack Financial Services" }],
  },
};

export default function FinancialServicesPage() {
  return <IndustryCategory categoryId="financial-services" />;
}
