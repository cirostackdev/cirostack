import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "it-services";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/it-services` },
  openGraph: {
    url: `https://cirostack.com/industries/it-services`,
    title: "Custom Software for IT Services — CiroStack",
    description: "We build ticketing systems, SLA tracking dashboards, and client portals for IT services companies — built by senior engineers who understand the operational reality.",
    images: [{ url: "https://cirostack.com/og/industry-pages/it-services.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/it-services.jpg"],
  },
};

export default function ItServicesPage() {
  return <Industry />;
}
