import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "corporate-training";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/corporate-training` },
  openGraph: {
    url: `https://cirostack.com/industries/corporate-training`,
    title: "Custom Software for Corporate Training | CiroStack",
    description: "We build learning management systems, assessment engines, and completion tracking dashboards that help corporate training teams roll out programs at scale and measure what sticks.",
    images: [{ url: "https://cirostack.com/og/industry-pages/corporate-training.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/corporate-training.jpg"],
  },
};

export default function CorporateTrainingPage() {
  return <Industry />;
}
