import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "architecture-firms-ce";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/architecture-firms-ce` },
  openGraph: {
    url: `https://cirostack.com/industries/architecture-firms-ce`,
    title: "Custom Software for Architecture Firms | CiroStack",
    description: "We build project timeline dashboards, client review portals, and resource allocation tools that help architecture firms manage complex builds without losing track of details.",
    images: [{ url: "https://cirostack.com/og/industry-pages/architecture-firms-ce.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/architecture-firms-ce.jpg"],
  },
};

export default function ArchitectureFirmsCePage() {
  return <Industry />;
}
