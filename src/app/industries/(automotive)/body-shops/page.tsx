import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "body-shops";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/body-shops` },
  openGraph: {
    url: `https://cirostack.com/industries/body-shops`,
    title: "Custom Software for Body Shops | CiroStack",
    description: "Our team builds estimate tracking tools, insurance claim integrations, and workflow dashboards so body shops can move vehicles through repair stages without paperwork bottlenecks.",
    images: [{ url: "https://cirostack.com/og/industry-pages/body-shops.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/body-shops.jpg"],
  },
};

export default function BodyShopsPage() {
  return <Industry />;
}
