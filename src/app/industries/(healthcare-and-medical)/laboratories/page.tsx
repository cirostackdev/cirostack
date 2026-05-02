import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "laboratories";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/laboratories` },
  openGraph: {
    url: `https://cirostack.com/industries/laboratories`,
    title: "Custom Software for Laboratories — CiroStack",
    description: "We build sample tracking systems, result reporting portals, and equipment calibration schedulers that help laboratories maintain accuracy and deliver findings to clients on time.",
    images: [{ url: "https://cirostack.com/og/industry-pages/laboratories.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/laboratories.jpg"],
  },
};

export default function LaboratoriesPage() {
  return <Industry />;
}
