import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "rental-cars";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/rental-cars` },
  openGraph: {
    url: `https://cirostack.com/industries/rental-cars`,
    title: "Custom Software for Rental Cars | CiroStack",
    description: "We build reservation platforms, fleet availability dashboards, and damage inspection apps that help rental car companies move vehicles faster and reduce disputes.",
    images: [{ url: "https://cirostack.com/og/industry-pages/rental-cars.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/rental-cars.jpg"],
  },
};

export default function RentalCarsPage() {
  return <Industry />;
}
