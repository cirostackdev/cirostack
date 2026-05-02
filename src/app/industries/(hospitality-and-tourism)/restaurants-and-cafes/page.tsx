import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "restaurants-and-cafes";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/restaurants-and-cafes` },
  openGraph: {
    url: `https://cirostack.com/industries/restaurants-and-cafes`,
    title: "Custom Software for Restaurants & Cafes | CiroStack",
    description: "From online ordering to kitchen display systems and loyalty programs, we build restaurant software that keeps the front and back of house in sync, delivered at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/restaurants-and-cafes.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/restaurants-and-cafes.jpg"],
  },
};

export default function RestaurantsAndCafesPage() {
  return <Industry />;
}
