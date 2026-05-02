import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "quality-control";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/quality-control` },
  openGraph: {
    url: `https://cirostack.com/industries/quality-control`,
    title: "Custom Software for Quality Control | CiroStack",
    description: "Our team builds inspection tracking apps, defect logging systems, and compliance reporting tools for quality control departments that refuse to cut corners.",
    images: [{ url: "https://cirostack.com/og/industry-pages/quality-control.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/quality-control.jpg"],
  },
};

export default function QualityControlPage() {
  return <Industry />;
}
