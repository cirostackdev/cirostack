import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "aviation";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/aviation` },
  openGraph: {
    url: `https://cirostack.com/industries/aviation`,
    title: "Custom Software for Aviation — CiroStack",
    description: "We build crew scheduling systems, maintenance tracking platforms, and flight operations dashboards for aviation companies where reliability is not optional.",
    images: [{ url: "https://cirostack.com/og/industry-pages/aviation.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/aviation.jpg"],
  },
};

export default function AviationPage() {
  return <Industry />;
}
