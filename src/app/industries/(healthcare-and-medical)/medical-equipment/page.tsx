import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "medical-equipment";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/medical-equipment` },
  openGraph: {
    url: `https://cirostack.com/industries/medical-equipment`,
    title: "Custom Software for Medical Equipment — CiroStack",
    description: "We build asset tracking platforms, maintenance scheduling tools, and order management systems that help medical equipment companies keep devices in service and customers supplied.",
    images: [{ url: "https://cirostack.com/og/industry-pages/medical-equipment.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/medical-equipment.jpg"],
  },
};

export default function MedicalEquipmentPage() {
  return <Industry />;
}
