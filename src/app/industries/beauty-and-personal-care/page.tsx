import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Beauty & Personal Care Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Beauty & Personal Care industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/beauty-and-personal-care" },
  openGraph: {
    url: "https://cirostack.com/industries/beauty-and-personal-care",
    title: "Beauty & Personal Care Software Solutions | CiroStack",
    description:
      "Custom software for the Beauty & Personal Care industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/images/pages/hero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Beauty & Personal Care" }],
  },
};

export default function BeautyAndPersonalCarePage() {
  return <IndustryCategory categoryId="beauty-and-personal-care" />;
}
