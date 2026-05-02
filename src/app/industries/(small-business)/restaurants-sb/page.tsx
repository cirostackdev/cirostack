import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "restaurants-sb";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/restaurants-sb` },
  openGraph: {
    url: `https://cirostack.com/industries/restaurants-sb`,
    title: "Custom Software for Restaurants — CiroStack",
    description: "We build online ordering platforms, reservation management tools, and kitchen display systems for restaurants that want to own their digital presence instead of paying commissions.",
    images: [{ url: "https://cirostack.com/og/industry-pages/restaurants-sb.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/restaurants-sb.jpg"],
  },
};

export default function RestaurantsSbPage() {
  return <Industry />;
}
