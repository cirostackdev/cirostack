import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "car-washes";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/car-washes` },
  openGraph: {
    url: `https://cirostack.com/industries/car-washes`,
    title: "Custom Software for Car Washes — CiroStack",
    description: "Membership management, queue tracking, and mobile payment apps — we build software that helps car washes reduce wait times and grow recurring revenue, delivered at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/car-washes.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/car-washes.jpg"],
  },
};

export default function CarWashesPage() {
  return <Industry />;
}
