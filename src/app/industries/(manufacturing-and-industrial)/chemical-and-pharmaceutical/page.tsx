import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "chemical-and-pharmaceutical";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/chemical-and-pharmaceutical` },
  openGraph: {
    url: `https://cirostack.com/industries/chemical-and-pharmaceutical`,
    title: "Custom Software for Chemical & Pharmaceutical — CiroStack",
    description: "CiroStack builds compliance-ready batch tracking, formula management, and lab data systems for chemical and pharmaceutical companies that need reliability from day one.",
    images: [{ url: "https://cirostack.com/og/industry-pages/chemical-and-pharmaceutical.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/chemical-and-pharmaceutical.jpg"],
  },
};

export default function ChemicalAndPharmaceuticalPage() {
  return <Industry />;
}
