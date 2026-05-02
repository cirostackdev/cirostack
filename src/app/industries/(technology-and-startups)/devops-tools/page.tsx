import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "devops-tools";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/devops-tools` },
  openGraph: {
    url: `https://cirostack.com/industries/devops-tools`,
    title: "Custom Software for DevOps Tools — CiroStack",
    description: "Our team builds deployment dashboards, infrastructure visualizers, and pipeline management interfaces for DevOps tool companies shipping to engineers who notice every rough edge.",
    images: [{ url: "https://cirostack.com/og/industry-pages/devops-tools.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/devops-tools.jpg"],
  },
};

export default function DevopsToolsPage() {
  return <Industry />;
}
