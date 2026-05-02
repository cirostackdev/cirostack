import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "procurement";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/procurement` },
  openGraph: {
    url: `https://cirostack.com/industries/procurement`,
    title: "Custom Software for Procurement | CiroStack",
    description: "We build vendor portals, purchase order workflows, and spend analytics platforms that give procurement teams full visibility into every dollar and every supplier relationship.",
    images: [{ url: "https://cirostack.com/og/industry-pages/procurement.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/procurement.jpg"],
  },
};

export default function ProcurementPage() {
  return <Industry />;
}
