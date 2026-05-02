import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "freight-forwarding";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/freight-forwarding` },
  openGraph: {
    url: `https://cirostack.com/industries/freight-forwarding`,
    title: "Custom Software for Freight Forwarding — CiroStack",
    description: "Our team builds shipment tracking portals, customs documentation tools, and rate quoting systems for freight forwarders managing cargo across borders — delivered at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/freight-forwarding.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/freight-forwarding.jpg"],
  },
};

export default function FreightForwardingPage() {
  return <Industry />;
}
