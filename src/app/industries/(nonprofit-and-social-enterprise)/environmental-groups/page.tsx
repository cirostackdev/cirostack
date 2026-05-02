import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "environmental-groups";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/environmental-groups` },
  openGraph: {
    url: `https://cirostack.com/industries/environmental-groups`,
    title: "Custom Software for Environmental Groups — CiroStack",
    description: "CiroStack builds field data collection apps, impact reporting dashboards, and volunteer management platforms for environmental organizations tracking real results on the ground.",
    images: [{ url: "https://cirostack.com/og/industry-pages/environmental-groups.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/environmental-groups.jpg"],
  },
};

export default function EnvironmentalGroupsPage() {
  return <Industry />;
}
