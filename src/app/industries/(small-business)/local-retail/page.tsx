import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "local-retail";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/local-retail` },
  openGraph: {
    url: `https://cirostack.com/industries/local-retail`,
    title: "Custom Software for Local Retail | CiroStack",
    description: "We build online ordering systems, loyalty reward apps, and local delivery platforms for neighborhood retailers competing with big-box stores on service and convenience.",
    images: [{ url: "https://cirostack.com/og/industry-pages/local-retail.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/local-retail.jpg"],
  },
};

export default function LocalRetailPage() {
  return <Industry />;
}
