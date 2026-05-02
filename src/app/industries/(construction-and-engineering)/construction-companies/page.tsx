import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "construction-companies";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/construction-companies` },
  openGraph: {
    url: `https://cirostack.com/industries/construction-companies`,
    title: "Custom Software for Construction Companies | CiroStack",
    description: "From bid management to daily logs and subcontractor coordination, we build job site software that construction companies actually use, scoped clearly and delivered at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/construction-companies.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/construction-companies.jpg"],
  },
};

export default function ConstructionCompaniesPage() {
  return <Industry />;
}
