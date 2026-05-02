import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "test-preparation";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/test-preparation` },
  openGraph: {
    url: `https://cirostack.com/industries/test-preparation`,
    title: "Custom Software for Test Preparation | CiroStack",
    description: "We build practice exam engines, score prediction tools, and study plan generators that help test prep companies deliver personalized experiences their students actually finish.",
    images: [{ url: "https://cirostack.com/og/industry-pages/test-preparation.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/test-preparation.jpg"],
  },
};

export default function TestPreparationPage() {
  return <Industry />;
}
