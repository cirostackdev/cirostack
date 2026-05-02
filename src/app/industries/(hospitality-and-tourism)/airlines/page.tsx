import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "airlines";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/airlines` },
  openGraph: {
    url: `https://cirostack.com/industries/airlines`,
    title: "Custom Software for Airlines — CiroStack",
    description: "We build crew scheduling systems, passenger self-service tools, and operations dashboards that help airlines run on time and give travelers the information they need at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/airlines.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/airlines.jpg"],
  },
};

export default function AirlinesPage() {
  return <Industry />;
}
