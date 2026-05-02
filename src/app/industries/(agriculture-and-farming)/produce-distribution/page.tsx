import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "produce-distribution";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/produce-distribution` },
  openGraph: {
    url: `https://cirostack.com/industries/produce-distribution`,
    title: "Custom Software for Produce Distribution — CiroStack",
    description: "Our senior engineers build route optimization tools, cold chain monitoring dashboards, and order management systems that keep produce distributors fast, fresh, and profitable.",
    images: [{ url: "https://cirostack.com/og/industry-pages/produce-distribution.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/produce-distribution.jpg"],
  },
};

export default function ProduceDistributionPage() {
  return <Industry />;
}
