import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "immigration-law";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/immigration-law` },
  openGraph: {
    url: `https://cirostack.com/industries/immigration-law`,
    title: "Custom Software for Immigration Law | CiroStack",
    description: "Our senior engineers build visa application trackers, document checklist managers, and client communication portals that help immigration law firms guide applicants through every step of the process.",
    images: [{ url: "https://cirostack.com/og/industry-pages/immigration-law.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/immigration-law.jpg"],
  },
};

export default function ImmigrationLawPage() {
  return <Industry />;
}
