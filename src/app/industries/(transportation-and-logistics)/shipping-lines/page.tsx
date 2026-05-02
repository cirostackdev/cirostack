import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "shipping-lines";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/shipping-lines` },
  openGraph: {
    url: `https://cirostack.com/industries/shipping-lines`,
    title: "Custom Software for Shipping Lines — CiroStack",
    description: "Our team creates container tracking platforms, voyage management systems, and port scheduling tools for shipping lines coordinating vessels, cargo, and tight turnaround windows.",
    images: [{ url: "https://cirostack.com/og/industry-pages/shipping-lines.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/shipping-lines.jpg"],
  },
};

export default function ShippingLinesPage() {
  return <Industry />;
}
