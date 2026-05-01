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
    images: [{ url: "https://cirostack.com/api/og?title=Manufacturing%20%26%20Industrial%20Software%20Solutions%20%7C%20CiroStack&description=Custom%20software%20for%20the%20Manufacturing%20%26%20Industrial%20industry.%20Fixed-price.%20Senior%20engineers.%20Shipped%20in%20weeks.&label=Industries", width: 1200, height: 630, alt: "CiroStack Manufacturing And Industrial" }],
  },
};

export default function ManufacturingAndIndustrialPage() {
  return <IndustryCategory categoryId="manufacturing-and-industrial" />;
}
