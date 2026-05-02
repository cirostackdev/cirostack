import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "cosmetics-brands";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/cosmetics-brands` },
  openGraph: {
    url: `https://cirostack.com/industries/cosmetics-brands`,
    title: "Custom Software for Cosmetics Brands | CiroStack",
    description: "We build shade-matching tools, subscription box platforms, and wholesale order portals that help cosmetics brands sell direct and manage retail relationships from one place.",
    images: [{ url: "https://cirostack.com/og/industry-pages/cosmetics-brands.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/cosmetics-brands.jpg"],
  },
};

export default function CosmeticsBrandsPage() {
  return <Industry />;
}
