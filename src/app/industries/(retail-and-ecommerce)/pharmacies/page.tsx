import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "pharmacies";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/pharmacies` },
  openGraph: {
    url: `https://cirostack.com/industries/pharmacies`,
    title: "Custom Software for Pharmacies | CiroStack",
    description: "CiroStack builds prescription management systems, refill reminder platforms, and compliance tracking dashboards for pharmacies balancing speed, accuracy, and patient trust.",
    images: [{ url: "https://cirostack.com/og/industry-pages/pharmacies.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/pharmacies.jpg"],
  },
};

export default function PharmaciesPage() {
  return <Industry />;
}
