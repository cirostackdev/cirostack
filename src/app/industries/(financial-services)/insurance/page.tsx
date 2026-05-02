import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "insurance";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/insurance` },
  openGraph: {
    url: `https://cirostack.com/industries/insurance`,
    title: "Custom Software for Insurance — CiroStack",
    description: "We build policy management systems, claims processing workflows, and agent dashboards that help insurance companies reduce paperwork and get policyholders the answers they need faster.",
    images: [{ url: "https://cirostack.com/og/industry-pages/insurance.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/insurance.jpg"],
  },
};

export default function InsurancePage() {
  return <Industry />;
}
