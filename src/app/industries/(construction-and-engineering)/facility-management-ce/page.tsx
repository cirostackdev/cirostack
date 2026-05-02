import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "facility-management-ce";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/facility-management-ce` },
  openGraph: {
    url: `https://cirostack.com/industries/facility-management-ce`,
    title: "Custom Software for Facility Management | CiroStack",
    description: "Our team builds work order systems, preventive maintenance schedulers, and space utilization dashboards that give facility managers full visibility into every building they oversee.",
    images: [{ url: "https://cirostack.com/og/industry-pages/facility-management-ce.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/facility-management-ce.jpg"],
  },
};

export default function FacilityManagementCePage() {
  return <Industry />;
}
