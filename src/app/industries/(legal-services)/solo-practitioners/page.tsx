import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "solo-practitioners";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/solo-practitioners` },
  openGraph: {
    url: `https://cirostack.com/industries/solo-practitioners`,
    title: "Custom Software for Solo Practitioners — CiroStack",
    description: "We build practice management dashboards, automated billing tools, and client communication portals that help solo practitioners run a one-person firm without feeling like they need a full staff.",
    images: [{ url: "https://cirostack.com/og/industry-pages/solo-practitioners.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/solo-practitioners.jpg"],
  },
};

export default function SoloPractitionersPage() {
  return <Industry />;
}
