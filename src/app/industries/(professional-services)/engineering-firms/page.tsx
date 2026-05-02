import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "engineering-firms";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/engineering-firms` },
  openGraph: {
    url: `https://cirostack.com/industries/engineering-firms`,
    title: "Custom Software for Engineering Firms — CiroStack",
    description: "We build project management dashboards, resource allocation tools, and document versioning systems for engineering firms juggling complex multi-phase projects and tight deadlines.",
    images: [{ url: "https://cirostack.com/og/industry-pages/engineering-firms.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/engineering-firms.jpg"],
  },
};

export default function EngineeringFirmsPage() {
  return <Industry />;
}
