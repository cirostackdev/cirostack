import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "auto-repair-shops";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/auto-repair-shops` },
  openGraph: {
    url: `https://cirostack.com/industries/auto-repair-shops`,
    title: "Custom Software for Auto Repair Shops | CiroStack",
    description: "From appointment scheduling to digital vehicle inspections and invoice generation, we build the shop management software auto repair businesses actually want to use, at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/auto-repair-shops.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/auto-repair-shops.jpg"],
  },
};

export default function AutoRepairShopsPage() {
  return <Industry />;
}
