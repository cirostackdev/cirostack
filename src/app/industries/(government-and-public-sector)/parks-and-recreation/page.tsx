import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "parks-and-recreation";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/parks-and-recreation` },
  openGraph: {
    url: `https://cirostack.com/industries/parks-and-recreation`,
    title: "Custom Software for Parks & Recreation — CiroStack",
    description: "Our team builds facility booking systems, program registration portals, and maintenance tracking dashboards that help parks and recreation departments keep communities active and engaged.",
    images: [{ url: "https://cirostack.com/og/industry-pages/parks-and-recreation.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/parks-and-recreation.jpg"],
  },
};

export default function ParksAndRecreationPage() {
  return <Industry />;
}
