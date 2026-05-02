import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "car-dealerships";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/car-dealerships` },
  openGraph: {
    url: `https://cirostack.com/industries/car-dealerships`,
    title: "Custom Software for Car Dealerships — CiroStack",
    description: "We build lot management systems, lead tracking CRMs, and financing workflow tools that help car dealerships close more deals and keep their sales floor organized.",
    images: [{ url: "https://cirostack.com/og/industry-pages/car-dealerships.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/car-dealerships.jpg"],
  },
};

export default function CarDealershipsPage() {
  return <Industry />;
}
