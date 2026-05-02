import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "gyms";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/gyms` },
  openGraph: {
    url: `https://cirostack.com/industries/gyms`,
    title: "Custom Software for Gyms — CiroStack",
    description: "Our senior engineers build access control integrations, class booking platforms, and membership analytics dashboards for gyms ready to modernize their operations at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/gyms.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/gyms.jpg"],
  },
};

export default function GymsPage() {
  return <Industry />;
}
