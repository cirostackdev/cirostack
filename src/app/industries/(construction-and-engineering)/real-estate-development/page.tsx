import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "real-estate-development";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/real-estate-development` },
  openGraph: {
    url: `https://cirostack.com/industries/real-estate-development`,
    title: "Custom Software for Real Estate Development | CiroStack",
    description: "We build deal pipeline trackers, construction milestone dashboards, and investor reporting portals that help real estate developers manage projects from land acquisition to lease-up.",
    images: [{ url: "https://cirostack.com/og/industry-pages/real-estate-development.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/real-estate-development.jpg"],
  },
};

export default function RealEstateDevelopmentPage() {
  return <Industry />;
}
