import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "pharmacies-medical";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/pharmacies-medical` },
  openGraph: {
    url: `https://cirostack.com/industries/pharmacies-medical`,
    title: "Custom Software for Pharmacies | CiroStack",
    description: "We build prescription management systems, refill reminder tools, and inventory dashboards that help pharmacies serve patients faster and keep shelves stocked with what people actually need.",
    images: [{ url: "https://cirostack.com/og/industry-pages/pharmacies-medical.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/pharmacies-medical.jpg"],
  },
};

export default function PharmaciesMedicalPage() {
  return <Industry />;
}
