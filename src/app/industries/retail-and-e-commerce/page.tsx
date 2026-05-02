import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Retail & E-Commerce Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Retail & E-Commerce industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/retail-and-e-commerce" },
  openGraph: {
    url: "https://cirostack.com/industries/retail-and-e-commerce",
    title: "Software for Retail & E-Commerce — CiroStack",
    description:
      "Online stores, POS systems, inventory management, and customer analytics for retailers. We build commerce software that sells more, tracks everything, and scales with your growth.",
    images: [{ url: "https://cirostack.com/og/industries/retail-and-e-commerce.jpg", width: 1200, height: 630, alt: "CiroStack Retail And E Commerce" }],
  },
};

export default function RetailAndECommercePage() {
  return <IndustryCategory categoryId="retail-and-e-commerce" />;
}
