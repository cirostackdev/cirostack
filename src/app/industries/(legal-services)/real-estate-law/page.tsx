import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "real-estate-law";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/real-estate-law` },
  openGraph: {
    url: `https://cirostack.com/industries/real-estate-law`,
    title: "Custom Software for Real Estate Law — CiroStack",
    description: "We build closing coordination platforms, title search trackers, and document management systems that help real estate law practices handle transactions smoothly from contract to keys.",
    images: [{ url: "https://cirostack.com/og/industry-pages/real-estate-law.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/real-estate-law.jpg"],
  },
};

export default function RealEstateLawPage() {
  return <Industry />;
}
