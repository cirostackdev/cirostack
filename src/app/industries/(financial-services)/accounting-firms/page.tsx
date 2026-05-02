import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "accounting-firms";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/accounting-firms` },
  openGraph: {
    url: `https://cirostack.com/industries/accounting-firms`,
    title: "Custom Software for Accounting Firms | CiroStack",
    description: "We build client portals, document collection workflows, and engagement tracking dashboards that help accounting firms manage tax season and year-round advisory work without the chaos.",
    images: [{ url: "https://cirostack.com/og/industry-pages/accounting-firms.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/accounting-firms.jpg"],
  },
};

export default function AccountingFirmsPage() {
  return <Industry />;
}
