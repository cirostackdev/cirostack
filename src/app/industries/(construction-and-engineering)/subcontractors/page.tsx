import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "subcontractors";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/subcontractors` },
  openGraph: {
    url: `https://cirostack.com/industries/subcontractors`,
    title: "Custom Software for Subcontractors — CiroStack",
    description: "We build bid response tools, time tracking apps, and compliance document managers that help subcontractors stay organized across multiple general contractors and job sites at once.",
    images: [{ url: "https://cirostack.com/og/industry-pages/subcontractors.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/subcontractors.jpg"],
  },
};

export default function SubcontractorsPage() {
  return <Industry />;
}
