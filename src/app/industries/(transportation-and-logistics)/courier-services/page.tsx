import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "courier-services";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/courier-services` },
  openGraph: {
    url: `https://cirostack.com/industries/courier-services`,
    title: "Custom Software for Courier Services — CiroStack",
    description: "CiroStack builds dispatch management tools, real-time package tracking systems, and driver route optimization platforms for courier services handling high-volume daily deliveries.",
    images: [{ url: "https://cirostack.com/og/industry-pages/courier-services.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/courier-services.jpg"],
  },
};

export default function CourierServicesPage() {
  return <Industry />;
}
