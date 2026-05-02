import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "yoga-studios";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/yoga-studios` },
  openGraph: {
    url: `https://cirostack.com/industries/yoga-studios`,
    title: "Custom Software for Yoga Studios | CiroStack",
    description: "CiroStack builds class booking apps, membership management tools, and instructor scheduling systems for yoga studios that want a calm, reliable digital experience for their students.",
    images: [{ url: "https://cirostack.com/og/industry-pages/yoga-studios.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/yoga-studios.jpg"],
  },
};

export default function YogaStudiosPage() {
  return <Industry />;
}
