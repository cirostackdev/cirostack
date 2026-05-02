import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "tour-operators";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/tour-operators` },
  openGraph: {
    url: `https://cirostack.com/industries/tour-operators`,
    title: "Custom Software for Tour Operators | CiroStack",
    description: "Our team builds trip planning platforms, group booking tools, and guide scheduling systems that help tour operators sell more seats and deliver unforgettable experiences on the ground.",
    images: [{ url: "https://cirostack.com/og/industry-pages/tour-operators.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/tour-operators.jpg"],
  },
};

export default function TourOperatorsPage() {
  return <Industry />;
}
