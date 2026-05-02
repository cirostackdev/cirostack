import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "property-management";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/property-management` },
  openGraph: {
    url: `https://cirostack.com/industries/property-management`,
    title: "Custom Software for Property Management — CiroStack",
    description: "Our team builds tenant portals, maintenance request systems, and rent collection dashboards for property management companies handling dozens or hundreds of units at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/property-management.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/property-management.jpg"],
  },
};

export default function PropertyManagementPage() {
  return <Industry />;
}
