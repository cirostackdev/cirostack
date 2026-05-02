import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Legal Services Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Legal Services industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/legal-services" },
  openGraph: {
    url: "https://cirostack.com/industries/legal-services",
    title: "Software for Legal Services | CiroStack",
    description:
      "Case management, document automation, and client portals for law firms and legal practices. We build tools that help attorneys spend less time on admin and more time practicing law.",
    images: [{ url: "https://cirostack.com/og/industries/legal-services.jpg", width: 1200, height: 630, alt: "CiroStack Legal Services" }],
  },
};

export default function LegalServicesPage() {
  return <IndustryCategory categoryId="legal-services" />;
}
