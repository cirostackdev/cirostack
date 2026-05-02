import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "forestry";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/forestry` },
  openGraph: {
    url: `https://cirostack.com/industries/forestry`,
    title: "Custom Software for Forestry — CiroStack",
    description: "Our team builds timber inventory systems, harvest planning tools, and environmental compliance dashboards tailored to forestry operations — scoped and priced before we write a line of code.",
    images: [{ url: "https://cirostack.com/og/industry-pages/forestry.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/forestry.jpg"],
  },
};

export default function ForestryPage() {
  return <Industry />;
}
