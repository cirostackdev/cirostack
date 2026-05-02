import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "delivery-services";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/delivery-services` },
  openGraph: {
    url: `https://cirostack.com/industries/delivery-services`,
    title: "Custom Software for Delivery Services — CiroStack",
    description: "We create order assignment systems, proof-of-delivery apps, and fleet tracking dashboards for delivery services scaling their operations without losing visibility.",
    images: [{ url: "https://cirostack.com/og/industry-pages/delivery-services.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/delivery-services.jpg"],
  },
};

export default function DeliveryServicesPage() {
  return <Industry />;
}
