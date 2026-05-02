import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "fashion-and-apparel";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/fashion-and-apparel` },
  openGraph: {
    url: `https://cirostack.com/industries/fashion-and-apparel`,
    title: "Custom Software for Fashion & Apparel | CiroStack",
    description: "CiroStack builds virtual try-on features, size recommendation tools, and lookbook platforms for fashion brands that want their online store to feel as good as their clothes.",
    images: [{ url: "https://cirostack.com/og/industry-pages/fashion-and-apparel.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/fashion-and-apparel.jpg"],
  },
};

export default function FashionAndApparelPage() {
  return <Industry />;
}
