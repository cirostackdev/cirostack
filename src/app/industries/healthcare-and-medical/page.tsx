import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Healthcare & Medical Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Healthcare & Medical industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/healthcare-and-medical" },
  openGraph: {
    url: "https://cirostack.com/industries/healthcare-and-medical",
    title: "Healthcare & Medical Software Solutions | CiroStack",
    description:
      "Custom software for the Healthcare & Medical industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/images/pages/hero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Healthcare & Medical" }],
  },
};

export default function HealthcareAndMedicalPage() {
  return <IndustryCategory categoryId="healthcare-and-medical" />;
}
