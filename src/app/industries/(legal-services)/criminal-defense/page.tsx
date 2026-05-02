import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "criminal-defense";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/criminal-defense` },
  openGraph: {
    url: `https://cirostack.com/industries/criminal-defense`,
    title: "Custom Software for Criminal Defense | CiroStack",
    description: "We build case management systems, evidence organization tools, and court deadline trackers that help criminal defense attorneys stay prepared and never miss a filing date.",
    images: [{ url: "https://cirostack.com/og/industry-pages/criminal-defense.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/criminal-defense.jpg"],
  },
};

export default function CriminalDefensePage() {
  return <Industry />;
}
