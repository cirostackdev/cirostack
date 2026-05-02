import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "farm-equipment";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/farm-equipment` },
  openGraph: {
    url: `https://cirostack.com/industries/farm-equipment`,
    title: "Custom Software for Farm Equipment — CiroStack",
    description: "We build dealer management systems, parts inventory trackers, and service scheduling apps that keep farm equipment businesses organized and their customers in the field.",
    images: [{ url: "https://cirostack.com/og/industry-pages/farm-equipment.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/farm-equipment.jpg"],
  },
};

export default function FarmEquipmentPage() {
  return <Industry />;
}
