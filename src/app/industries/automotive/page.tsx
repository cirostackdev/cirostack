import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Automotive Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Automotive industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/automotive" },
  openGraph: {
    url: "https://cirostack.com/industries/automotive",
    title: "Automotive Software Solutions | CiroStack",
    description:
      "Custom software for the Automotive industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/images/pages/hero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Automotive" }],
  },
};

export default function AutomotivePage() {
  return <IndustryCategory categoryId="automotive" />;
}
