import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "furniture-and-home-decor";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/furniture-and-home-decor` },
  openGraph: {
    url: `https://cirostack.com/industries/furniture-and-home-decor`,
    title: "Custom Software for Furniture & Home Decor — CiroStack",
    description: "We create room visualization tools, custom order configurators, and delivery scheduling platforms for furniture and home decor businesses selling high-consideration products.",
    images: [{ url: "https://cirostack.com/og/industry-pages/furniture-and-home-decor.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/furniture-and-home-decor.jpg"],
  },
};

export default function FurnitureAndHomeDecorPage() {
  return <Industry />;
}
