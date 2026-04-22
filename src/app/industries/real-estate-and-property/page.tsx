import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Real Estate & Property Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Real Estate & Property industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/real-estate-and-property" },
  openGraph: {
    url: "https://cirostack.com/industries/real-estate-and-property",
    title: "Real Estate & Property Software Solutions | CiroStack",
    description:
      "Custom software for the Real Estate & Property industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/images/pages/hero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Real Estate & Property" }],
  },
};

export default function RealEstateAndPropertyPage() {
  return <IndustryCategory categoryId="real-estate-and-property" />;
}
