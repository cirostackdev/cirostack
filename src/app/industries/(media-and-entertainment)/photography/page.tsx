import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "photography";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/photography` },
  openGraph: {
    url: `https://cirostack.com/industries/photography`,
    title: "Custom Software for Photography — CiroStack",
    description: "We build client galleries, booking management systems, and automated delivery platforms for photography businesses ready to streamline their workflow from shoot to final delivery.",
    images: [{ url: "https://cirostack.com/og/industry-pages/photography.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/photography.jpg"],
  },
};

export default function PhotographyPage() {
  return <Industry />;
}
