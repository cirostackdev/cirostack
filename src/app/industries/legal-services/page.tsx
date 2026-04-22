import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Legal Services Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Legal Services industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/legal-services" },
  openGraph: {
    url: "https://cirostack.com/industries/legal-services",
    title: "Legal Services Software Solutions | CiroStack",
    description:
      "Custom software for the Legal Services industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/images/pages/hero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Legal Services" }],
  },
};

export default function LegalServicesPage() {
  return <IndustryCategory categoryId="legal-services" />;
}
