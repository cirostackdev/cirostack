import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "estate-planning";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/estate-planning` },
  openGraph: {
    url: `https://cirostack.com/industries/estate-planning`,
    title: "Custom Software for Estate Planning — CiroStack",
    description: "Our team builds document assembly tools, client intake workflows, and asset inventory dashboards that help estate planning attorneys serve families efficiently at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/estate-planning.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/estate-planning.jpg"],
  },
};

export default function EstatePlanningPage() {
  return <Industry />;
}
