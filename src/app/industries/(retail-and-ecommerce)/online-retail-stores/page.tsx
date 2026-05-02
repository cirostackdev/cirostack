import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "online-retail-stores";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/online-retail-stores` },
  openGraph: {
    url: `https://cirostack.com/industries/online-retail-stores`,
    title: "Custom Software for Online Retail Stores | CiroStack",
    description: "We build custom storefronts, checkout optimization tools, and order fulfillment dashboards for online retailers who have outgrown their template-based ecommerce platform.",
    images: [{ url: "https://cirostack.com/og/industry-pages/online-retail-stores.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/online-retail-stores.jpg"],
  },
};

export default function OnlineRetailStoresPage() {
  return <Industry />;
}
