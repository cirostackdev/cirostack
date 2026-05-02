import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "property-development";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/property-development` },
  openGraph: {
    url: `https://cirostack.com/industries/property-development`,
    title: "Custom Software for Property Development | CiroStack",
    description: "We create project timeline dashboards, contractor coordination tools, and budget tracking systems for property developers managing builds from acquisition through handover.",
    images: [{ url: "https://cirostack.com/og/industry-pages/property-development.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/property-development.jpg"],
  },
};

export default function PropertyDevelopmentPage() {
  return <Industry />;
}
