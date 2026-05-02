import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Real Estate & Property Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Real Estate & Property industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/real-estate-and-property" },
  openGraph: {
    url: "https://cirostack.com/industries/real-estate-and-property",
    title: "Software for Real Estate & Property | CiroStack",
    description:
      "Listing platforms, property management tools, and CRM systems for agents, brokers, and property managers. We build real estate software that helps you close more deals and manage properties smarter.",
    images: [{ url: "https://cirostack.com/og/industries/real-estate-and-property.jpg", width: 1200, height: 630, alt: "CiroStack Real Estate And Property" }],
  },
};

export default function RealEstateAndPropertyPage() {
  return <IndustryCategory categoryId="real-estate-and-property" />;
}
