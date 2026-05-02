import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "foundations";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/foundations` },
  openGraph: {
    url: `https://cirostack.com/industries/foundations`,
    title: "Custom Software for Foundations — CiroStack",
    description: "We build grant management portals, applicant review systems, and impact measurement dashboards so foundations can focus on funding good work instead of wrestling with spreadsheets.",
    images: [{ url: "https://cirostack.com/og/industry-pages/foundations.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/foundations.jpg"],
  },
};

export default function FoundationsPage() {
  return <Industry />;
}
