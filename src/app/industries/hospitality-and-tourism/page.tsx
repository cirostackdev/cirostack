import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Hospitality & Tourism Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Hospitality & Tourism industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/hospitality-and-tourism" },
  openGraph: {
    url: "https://cirostack.com/industries/hospitality-and-tourism",
    title: "Hospitality & Tourism Software Solutions | CiroStack",
    description:
      "Custom software for the Hospitality & Tourism industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/api/og?title=Hospitality%20%26%20Tourism%20Software%20Solutions%20%7C%20CiroStack&description=Custom%20software%20for%20the%20Hospitality%20%26%20Tourism%20industry.%20Fixed-price.%20Senior%20engineers.%20Shipped%20in%20weeks.&label=Industries&bg=%2Fimages%2Fpages%2Fhero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Hospitality And Tourism" }],
  },
};

export default function HospitalityAndTourismPage() {
  return <IndustryCategory categoryId="hospitality-and-tourism" />;
}
