import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "contractors-sb";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/contractors-sb` },
  openGraph: {
    url: `https://cirostack.com/industries/contractors-sb`,
    title: "Custom Software for Contractors | CiroStack",
    description: "We build estimate calculators, job scheduling apps, and invoicing tools for contractors who spend too much time on paperwork and not enough time on the job site.",
    images: [{ url: "https://cirostack.com/og/industry-pages/contractors-sb.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/contractors-sb.jpg"],
  },
};

export default function ContractorsSbPage() {
  return <Industry />;
}
