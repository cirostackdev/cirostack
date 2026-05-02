import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "warehousing-tl";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/warehousing-tl` },
  openGraph: {
    url: `https://cirostack.com/industries/warehousing-tl`,
    title: "Custom Software for Warehousing | CiroStack",
    description: "CiroStack builds inventory management systems, receiving and shipping dashboards, and warehouse layout optimization tools for logistics warehouses handling high-volume throughput at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/warehousing-tl.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/warehousing-tl.jpg"],
  },
};

export default function WarehousingTlPage() {
  return <Industry />;
}
