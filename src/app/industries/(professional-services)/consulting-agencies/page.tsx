import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "consulting-agencies";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/consulting-agencies` },
  openGraph: {
    url: `https://cirostack.com/industries/consulting-agencies`,
    title: "Custom Software for Consulting Agencies — CiroStack",
    description: "Our team creates engagement tracking systems, deliverable management platforms, and time-and-billing tools for consulting agencies that need clean operations at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/consulting-agencies.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/consulting-agencies.jpg"],
  },
};

export default function ConsultingAgenciesPage() {
  return <Industry />;
}
