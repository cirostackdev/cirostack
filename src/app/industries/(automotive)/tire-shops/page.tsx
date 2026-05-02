import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "tire-shops";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/tire-shops` },
  openGraph: {
    url: `https://cirostack.com/industries/tire-shops`,
    title: "Custom Software for Tire Shops — CiroStack",
    description: "From appointment booking to tire size lookups and seasonal promotion engines, we build the tools tire shops need to keep bays full and customers informed — all fixed-price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/tire-shops.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/tire-shops.jpg"],
  },
};

export default function TireShopsPage() {
  return <Industry />;
}
