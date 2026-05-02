import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "bed-and-breakfasts";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/bed-and-breakfasts` },
  openGraph: {
    url: `https://cirostack.com/industries/bed-and-breakfasts`,
    title: "Custom Software for Bed & Breakfasts — CiroStack",
    description: "Our team builds direct booking engines, guest experience portals, and channel management tools that help bed and breakfasts fill rooms without relying entirely on third-party listing sites.",
    images: [{ url: "https://cirostack.com/og/industry-pages/bed-and-breakfasts.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/bed-and-breakfasts.jpg"],
  },
};

export default function BedAndBreakfastsPage() {
  return <Industry />;
}
