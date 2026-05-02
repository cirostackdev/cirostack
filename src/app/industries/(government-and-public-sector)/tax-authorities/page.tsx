import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "tax-authorities";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/tax-authorities` },
  openGraph: {
    url: `https://cirostack.com/industries/tax-authorities`,
    title: "Custom Software for Tax Authorities — CiroStack",
    description: "Our senior engineers build taxpayer self-service portals, audit workflow tools, and revenue tracking dashboards that help tax authorities process filings accurately and reduce backlogs.",
    images: [{ url: "https://cirostack.com/og/industry-pages/tax-authorities.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/tax-authorities.jpg"],
  },
};

export default function TaxAuthoritiesPage() {
  return <Industry />;
}
