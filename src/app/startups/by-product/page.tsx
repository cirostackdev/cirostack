import type { Metadata } from "next";
import StartupCategory from "@/pages-src/StartupCategory";

export const metadata: Metadata = {
  title: "By Product Type - Startup Software Solutions | CiroStack",
  description:
    "CiroStack builds custom software for startups. Explore our by product type offerings with fixed-price engagements and senior engineers.",
  alternates: { canonical: "https://cirostack.com/startups/by-product" },
  openGraph: {
    url: "https://cirostack.com/startups/by-product",
    title: "By Product Type - Software for Startups | CiroStack",
    description:
      "Fixed-price startup software development. Senior engineers. Shipped in weeks.",
  },
};

export default function ByProductPage() {
  return <StartupCategory categoryId="by-product" />;
}
