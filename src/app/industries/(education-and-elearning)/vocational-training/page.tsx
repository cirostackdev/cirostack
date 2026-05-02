import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "vocational-training";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/vocational-training` },
  openGraph: {
    url: `https://cirostack.com/industries/vocational-training`,
    title: "Custom Software for Vocational Training | CiroStack",
    description: "Our team builds skills assessment tools, certification tracking systems, and employer partnership portals that help vocational training programs connect graduates with real jobs.",
    images: [{ url: "https://cirostack.com/og/industry-pages/vocational-training.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/vocational-training.jpg"],
  },
};

export default function VocationalTrainingPage() {
  return <Industry />;
}
