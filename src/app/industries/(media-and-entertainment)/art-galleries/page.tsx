import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "art-galleries";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/art-galleries` },
  openGraph: {
    url: `https://cirostack.com/industries/art-galleries`,
    title: "Custom Software for Art Galleries — CiroStack",
    description: "We build online exhibition platforms, collector CRM tools, and artwork inventory systems that help galleries manage their collection and connect with buyers — all at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/art-galleries.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/art-galleries.jpg"],
  },
};

export default function ArtGalleriesPage() {
  return <Industry />;
}
