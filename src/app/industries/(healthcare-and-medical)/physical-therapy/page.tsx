import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "physical-therapy";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/physical-therapy` },
  openGraph: {
    url: `https://cirostack.com/industries/physical-therapy`,
    title: "Custom Software for Physical Therapy | CiroStack",
    description: "We build home exercise program builders, patient progress trackers, and scheduling platforms that help physical therapy clinics deliver better outcomes and keep patients on track.",
    images: [{ url: "https://cirostack.com/og/industry-pages/physical-therapy.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/physical-therapy.jpg"],
  },
};

export default function PhysicalTherapyPage() {
  return <Industry />;
}
