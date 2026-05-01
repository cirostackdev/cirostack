import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "commercial-real-estate";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/commercial-real-estate` },
  openGraph: {
    url: `https://cirostack.com/industries/commercial-real-estate`,
    title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
    description: industry?.tagline ?? "",
    images: [{ url: "https://cirostack.com/images/industries/hero-commercial-real-estate.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/images/industries/hero-commercial-real-estate.jpg"],
  },
};

export default function CommercialRealEstatePage() {
  return <Industry />;
}
