import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "automotive-parts";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/automotive-parts` },
  openGraph: {
    url: `https://cirostack.com/industries/automotive-parts`,
    title: "Custom Software for Automotive Parts — CiroStack",
    description: "We build parts catalog systems, fitment databases, and inventory management platforms for automotive parts retailers selling online, in-store, or both.",
    images: [{ url: "https://cirostack.com/og/industry-pages/automotive-parts.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/automotive-parts.jpg"],
  },
};

export default function AutomotivePartsPage() {
  return <Industry />;
}
