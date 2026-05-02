import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "mental-health";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/mental-health` },
  openGraph: {
    url: `https://cirostack.com/industries/mental-health`,
    title: "Custom Software for Mental Health | CiroStack",
    description: "Our team builds secure client portals, session scheduling tools, and progress tracking dashboards that help mental health practices manage caseloads while keeping patient data safe.",
    images: [{ url: "https://cirostack.com/og/industry-pages/mental-health.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/mental-health.jpg"],
  },
};

export default function MentalHealthPage() {
  return <Industry />;
}
