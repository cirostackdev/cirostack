import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Professional Services Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Professional Services industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/professional-services" },
  openGraph: {
    url: "https://cirostack.com/industries/professional-services",
    title: "Software for Professional Services — CiroStack",
    description:
      "Client portals, project tracking, and operations tools for consulting firms, agencies, and professional practices. We build software that helps service businesses scale without losing the personal touch.",
    images: [{ url: "https://cirostack.com/og/industries/professional-services.jpg", width: 1200, height: 630, alt: "CiroStack Professional Services" }],
  },
};

export default function ProfessionalServicesPage() {
  return <IndustryCategory categoryId="professional-services" />;
}
