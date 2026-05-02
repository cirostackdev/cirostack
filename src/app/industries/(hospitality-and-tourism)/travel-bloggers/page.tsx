import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "travel-bloggers";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/travel-bloggers` },
  openGraph: {
    url: `https://cirostack.com/industries/travel-bloggers`,
    title: "Custom Software for Travel Bloggers — CiroStack",
    description: "Our senior engineers build content management platforms, affiliate link dashboards, and audience analytics tools that help travel bloggers monetize their adventures and grow their readership.",
    images: [{ url: "https://cirostack.com/og/industry-pages/travel-bloggers.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/travel-bloggers.jpg"],
  },
};

export default function TravelBloggersPage() {
  return <Industry />;
}
