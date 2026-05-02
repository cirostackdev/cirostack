import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "agribusiness";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/agribusiness` },
  openGraph: {
    url: `https://cirostack.com/industries/agribusiness`,
    title: "Custom Software for Agribusiness — CiroStack",
    description: "We build supply chain platforms, crop analytics dashboards, and inventory systems that help agribusiness operations run smarter from seed to sale — all at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/agribusiness.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/agribusiness.jpg"],
  },
};

export default function AgribusinessPage() {
  return <Industry />;
}
