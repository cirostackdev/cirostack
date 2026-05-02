import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "beauty-and-cosmetics";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/beauty-and-cosmetics` },
  openGraph: {
    url: `https://cirostack.com/industries/beauty-and-cosmetics`,
    title: "Custom Software for Beauty & Cosmetics — CiroStack",
    description: "CiroStack creates shade-matching tools, subscription box platforms, and product recommendation engines for beauty and cosmetics brands ready to stand out online.",
    images: [{ url: "https://cirostack.com/og/industry-pages/beauty-and-cosmetics.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/beauty-and-cosmetics.jpg"],
  },
};

export default function BeautyAndCosmeticsPage() {
  return <Industry />;
}
