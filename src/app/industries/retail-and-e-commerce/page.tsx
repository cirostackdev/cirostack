import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Retail & E-Commerce Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Retail & E-Commerce industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/retail-and-e-commerce" },
  openGraph: {
    url: "https://cirostack.com/industries/retail-and-e-commerce",
    title: "Retail & E-Commerce Software Solutions | CiroStack",
    description:
      "Custom software for the Retail & E-Commerce industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/images/pages/hero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Retail & E-Commerce" }],
  },
};

export default function RetailAndECommercePage() {
  return <IndustryCategory categoryId="retail-and-e-commerce" />;
}
