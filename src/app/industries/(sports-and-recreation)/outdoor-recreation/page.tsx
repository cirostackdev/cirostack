import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "outdoor-recreation";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/outdoor-recreation` },
  openGraph: {
    url: `https://cirostack.com/industries/outdoor-recreation`,
    title: "Custom Software for Outdoor Recreation — CiroStack",
    description: "CiroStack builds trip booking platforms, equipment rental trackers, and waiver management systems for outdoor recreation businesses handling groups, gear, and unpredictable conditions.",
    images: [{ url: "https://cirostack.com/og/industry-pages/outdoor-recreation.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/outdoor-recreation.jpg"],
  },
};

export default function OutdoorRecreationPage() {
  return <Industry />;
}
