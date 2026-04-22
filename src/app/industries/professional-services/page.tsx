import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Professional Services Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Professional Services industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/professional-services" },
  openGraph: {
    url: "https://cirostack.com/industries/professional-services",
    title: "Professional Services Software Solutions | CiroStack",
    description:
      "Custom software for the Professional Services industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/images/pages/hero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Professional Services" }],
  },
};

export default function ProfessionalServicesPage() {
  return <IndustryCategory categoryId="professional-services" />;
}
