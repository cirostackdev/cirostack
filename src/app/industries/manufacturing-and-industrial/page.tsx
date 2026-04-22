import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Manufacturing & Industrial Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Manufacturing & Industrial industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/manufacturing-and-industrial" },
  openGraph: {
    url: "https://cirostack.com/industries/manufacturing-and-industrial",
    title: "Manufacturing & Industrial Software Solutions | CiroStack",
    description:
      "Custom software for the Manufacturing & Industrial industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/images/pages/hero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Manufacturing & Industrial" }],
  },
};

export default function ManufacturingAndIndustrialPage() {
  return <IndustryCategory categoryId="manufacturing-and-industrial" />;
}
