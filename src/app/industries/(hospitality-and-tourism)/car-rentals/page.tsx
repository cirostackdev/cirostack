import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "car-rentals";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/car-rentals` },
  openGraph: {
    url: `https://cirostack.com/industries/car-rentals`,
    title: "Custom Software for Car Rentals — CiroStack",
    description: "We build online reservation systems, fleet tracking dashboards, and damage documentation apps that help car rental companies turn vehicles around faster and reduce disputes at drop-off.",
    images: [{ url: "https://cirostack.com/og/industry-pages/car-rentals.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/car-rentals.jpg"],
  },
};

export default function CarRentalsPage() {
  return <Industry />;
}
