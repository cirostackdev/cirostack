import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "fisheries";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/fisheries` },
  openGraph: {
    url: `https://cirostack.com/industries/fisheries`,
    title: "Custom Software for Fisheries | CiroStack",
    description: "We build catch tracking systems, fleet coordination tools, and compliance reporting platforms that help fisheries stay productive and meet regulatory requirements without manual headaches.",
    images: [{ url: "https://cirostack.com/og/industry-pages/fisheries.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/fisheries.jpg"],
  },
};

export default function FisheriesPage() {
  return <Industry />;
}
