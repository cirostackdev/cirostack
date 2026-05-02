import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "distribution";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/distribution` },
  openGraph: {
    url: `https://cirostack.com/industries/distribution`,
    title: "Custom Software for Distribution | CiroStack",
    description: "We design route optimization tools, order management platforms, and real-time shipment tracking systems that help distribution companies move product faster and cut waste.",
    images: [{ url: "https://cirostack.com/og/industry-pages/distribution.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/distribution.jpg"],
  },
};

export default function DistributionPage() {
  return <Industry />;
}
