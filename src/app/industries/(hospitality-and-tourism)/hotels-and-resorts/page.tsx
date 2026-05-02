import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "hotels-and-resorts";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/hotels-and-resorts` },
  openGraph: {
    url: `https://cirostack.com/industries/hotels-and-resorts`,
    title: "Custom Software for Hotels & Resorts — CiroStack",
    description: "We build direct booking platforms, guest request portals, and housekeeping coordination tools that help hotels and resorts deliver memorable stays while keeping operations tight.",
    images: [{ url: "https://cirostack.com/og/industry-pages/hotels-and-resorts.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/hotels-and-resorts.jpg"],
  },
};

export default function HotelsAndResortsPage() {
  return <Industry />;
}
