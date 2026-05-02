import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "facility-management";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/facility-management` },
  openGraph: {
    url: `https://cirostack.com/industries/facility-management`,
    title: "Custom Software for Facility Management | CiroStack",
    description: "We build maintenance request systems, vendor coordination platforms, and building analytics dashboards for facility management teams responsible for keeping everything running.",
    images: [{ url: "https://cirostack.com/og/industry-pages/facility-management.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/facility-management.jpg"],
  },
};

export default function FacilityManagementPage() {
  return <Industry />;
}
