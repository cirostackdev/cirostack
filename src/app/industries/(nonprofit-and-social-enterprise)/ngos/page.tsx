import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "ngos";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/ngos` },
  openGraph: {
    url: `https://cirostack.com/industries/ngos`,
    title: "Custom Software for NGOs | CiroStack",
    description: "We build field reporting systems, beneficiary tracking databases, and program dashboards for NGOs operating across regions, delivered at a fixed price with no scope surprises.",
    images: [{ url: "https://cirostack.com/og/industry-pages/ngos.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/ngos.jpg"],
  },
};

export default function NgosPage() {
  return <Industry />;
}
