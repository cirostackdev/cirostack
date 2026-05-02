import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "architecture-firms";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/architecture-firms` },
  openGraph: {
    url: `https://cirostack.com/industries/architecture-firms`,
    title: "Custom Software for Architecture Firms | CiroStack",
    description: "CiroStack builds project tracking dashboards, client review portals, and resource planning tools for architecture firms managing multiple projects and tight deadlines.",
    images: [{ url: "https://cirostack.com/og/industry-pages/architecture-firms.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/architecture-firms.jpg"],
  },
};

export default function ArchitectureFirmsPage() {
  return <Industry />;
}
