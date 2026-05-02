import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "farms";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/farms` },
  openGraph: {
    url: `https://cirostack.com/industries/farms`,
    title: "Custom Software for Farms — CiroStack",
    description: "From crop rotation planners to irrigation monitoring dashboards, we build the digital tools farms actually need — delivered by senior engineers at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/farms.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/farms.jpg"],
  },
};

export default function FarmsPage() {
  return <Industry />;
}
