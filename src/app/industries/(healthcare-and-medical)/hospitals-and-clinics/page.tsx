import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "hospitals-and-clinics";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/hospitals-and-clinics` },
  openGraph: {
    url: `https://cirostack.com/industries/hospitals-and-clinics`,
    title: "Custom Software for Hospitals & Clinics | CiroStack",
    description: "Our senior engineers build patient intake systems, appointment scheduling platforms, and clinical workflow dashboards that help hospitals and clinics reduce wait times and improve care coordination.",
    images: [{ url: "https://cirostack.com/og/industry-pages/hospitals-and-clinics.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/hospitals-and-clinics.jpg"],
  },
};

export default function HospitalsAndClinicsPage() {
  return <Industry />;
}
