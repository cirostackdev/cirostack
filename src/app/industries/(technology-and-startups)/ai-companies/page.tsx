import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "ai-companies";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/ai-companies` },
  openGraph: {
    url: `https://cirostack.com/industries/ai-companies`,
    title: "Custom Software for AI Companies — CiroStack",
    description: "We build model monitoring dashboards, annotation pipeline tools, and customer-facing AI demos for AI companies that need production-grade interfaces, not just notebooks.",
    images: [{ url: "https://cirostack.com/og/industry-pages/ai-companies.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/ai-companies.jpg"],
  },
};

export default function AiCompaniesPage() {
  return <Industry />;
}
