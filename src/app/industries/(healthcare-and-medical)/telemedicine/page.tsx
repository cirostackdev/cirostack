import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "telemedicine";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/telemedicine` },
  openGraph: {
    url: `https://cirostack.com/industries/telemedicine`,
    title: "Custom Software for Telemedicine — CiroStack",
    description: "We build virtual visit platforms, patient intake workflows, and provider scheduling tools that help telemedicine companies deliver convenient care without sacrificing the clinical experience.",
    images: [{ url: "https://cirostack.com/og/industry-pages/telemedicine.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/telemedicine.jpg"],
  },
};

export default function TelemedicinePage() {
  return <Industry />;
}
