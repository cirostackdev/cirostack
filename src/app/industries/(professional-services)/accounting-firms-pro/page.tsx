import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "accounting-firms-pro";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/accounting-firms-pro` },
  openGraph: {
    url: `https://cirostack.com/industries/accounting-firms-pro`,
    title: "Custom Software for Accounting Firms — CiroStack",
    description: "We build client portals, document management systems, and workflow automation tools that help accounting firms handle tax season and year-round engagements without the chaos.",
    images: [{ url: "https://cirostack.com/og/industry-pages/accounting-firms-pro.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/accounting-firms-pro.jpg"],
  },
};

export default function AccountingFirmsProPage() {
  return <Industry />;
}
