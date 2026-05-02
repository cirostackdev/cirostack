import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "livestock-management";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/livestock-management` },
  openGraph: {
    url: `https://cirostack.com/industries/livestock-management`,
    title: "Custom Software for Livestock Management | CiroStack",
    description: "We build herd tracking platforms, feed management systems, and health monitoring dashboards that give livestock operations real visibility into animal welfare and productivity.",
    images: [{ url: "https://cirostack.com/og/industry-pages/livestock-management.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/livestock-management.jpg"],
  },
};

export default function LivestockManagementPage() {
  return <Industry />;
}
