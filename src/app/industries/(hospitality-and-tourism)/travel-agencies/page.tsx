import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "travel-agencies";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/travel-agencies` },
  openGraph: {
    url: `https://cirostack.com/industries/travel-agencies`,
    title: "Custom Software for Travel Agencies — CiroStack",
    description: "We build itinerary builders, supplier booking integrations, and client portals that help travel agencies craft personalized trips and manage bookings without juggling a dozen browser tabs.",
    images: [{ url: "https://cirostack.com/og/industry-pages/travel-agencies.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/travel-agencies.jpg"],
  },
};

export default function TravelAgenciesPage() {
  return <Industry />;
}
