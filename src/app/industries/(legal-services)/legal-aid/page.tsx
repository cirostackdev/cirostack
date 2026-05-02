import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "legal-aid";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/legal-aid` },
  openGraph: {
    url: `https://cirostack.com/industries/legal-aid`,
    title: "Custom Software for Legal Aid — CiroStack",
    description: "Our team builds intake screening tools, case assignment workflows, and outcome tracking dashboards that help legal aid organizations serve more people with limited resources — delivered at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/legal-aid.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/legal-aid.jpg"],
  },
};

export default function LegalAidPage() {
  return <Industry />;
}
