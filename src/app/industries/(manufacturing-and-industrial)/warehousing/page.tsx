import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "warehousing";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/warehousing` },
  openGraph: {
    url: `https://cirostack.com/industries/warehousing`,
    title: "Custom Software for Warehousing | CiroStack",
    description: "CiroStack builds warehouse management systems, pick-and-pack optimization tools, and real-time inventory dashboards that keep your warehouse floor running smoothly without guesswork.",
    images: [{ url: "https://cirostack.com/og/industry-pages/warehousing.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/warehousing.jpg"],
  },
};

export default function WarehousingPage() {
  return <Industry />;
}
