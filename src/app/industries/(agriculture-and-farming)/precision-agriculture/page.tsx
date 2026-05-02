import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "precision-agriculture";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/precision-agriculture` },
  openGraph: {
    url: `https://cirostack.com/industries/precision-agriculture`,
    title: "Custom Software for Precision Agriculture — CiroStack",
    description: "We build sensor integration platforms, field mapping tools, and yield prediction dashboards that turn precision agriculture data into decisions your team can act on today.",
    images: [{ url: "https://cirostack.com/og/industry-pages/precision-agriculture.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/precision-agriculture.jpg"],
  },
};

export default function PrecisionAgriculturePage() {
  return <Industry />;
}
