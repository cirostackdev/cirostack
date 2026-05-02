import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "cybersecurity";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/cybersecurity` },
  openGraph: {
    url: `https://cirostack.com/industries/cybersecurity`,
    title: "Custom Software for Cybersecurity | CiroStack",
    description: "CiroStack builds threat monitoring dashboards, incident response trackers, and compliance reporting tools for cybersecurity firms protecting their clients around the clock.",
    images: [{ url: "https://cirostack.com/og/industry-pages/cybersecurity.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/cybersecurity.jpg"],
  },
};

export default function CybersecurityPage() {
  return <Industry />;
}
