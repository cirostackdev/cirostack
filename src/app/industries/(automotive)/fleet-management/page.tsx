import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "fleet-management";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/fleet-management` },
  openGraph: {
    url: `https://cirostack.com/industries/fleet-management`,
    title: "Custom Software for Fleet Management — CiroStack",
    description: "We build vehicle tracking dashboards, maintenance scheduling systems, and driver performance tools that give fleet managers real-time control over every asset on the road.",
    images: [{ url: "https://cirostack.com/og/industry-pages/fleet-management.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/fleet-management.jpg"],
  },
};

export default function FleetManagementPage() {
  return <Industry />;
}
