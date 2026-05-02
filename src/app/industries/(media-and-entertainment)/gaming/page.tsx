import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "gaming";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/gaming` },
  openGraph: {
    url: `https://cirostack.com/industries/gaming`,
    title: "Custom Software for Gaming | CiroStack",
    description: "CiroStack builds backend services, player analytics dashboards, and community management platforms for gaming companies focused on growth and player retention.",
    images: [{ url: "https://cirostack.com/og/industry-pages/gaming.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/gaming.jpg"],
  },
};

export default function GamingPage() {
  return <Industry />;
}
