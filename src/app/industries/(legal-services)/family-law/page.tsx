import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "family-law";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/family-law` },
  openGraph: {
    url: `https://cirostack.com/industries/family-law`,
    title: "Custom Software for Family Law | CiroStack",
    description: "We build case tracking systems, document sharing portals, and parenting schedule tools that help family law firms manage sensitive matters with the care and organization they require.",
    images: [{ url: "https://cirostack.com/og/industry-pages/family-law.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/family-law.jpg"],
  },
};

export default function FamilyLawPage() {
  return <Industry />;
}
