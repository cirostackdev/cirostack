import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "vacation-rentals";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/vacation-rentals` },
  openGraph: {
    url: `https://cirostack.com/industries/vacation-rentals`,
    title: "Custom Software for Vacation Rentals | CiroStack",
    description: "Our senior engineers build multi-channel booking managers, dynamic pricing tools, and guest communication platforms for vacation rental operators scaling beyond a handful of listings.",
    images: [{ url: "https://cirostack.com/og/industry-pages/vacation-rentals.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/vacation-rentals.jpg"],
  },
};

export default function VacationRentalsPage() {
  return <Industry />;
}
