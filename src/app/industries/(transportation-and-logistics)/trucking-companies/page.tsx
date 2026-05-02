import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "trucking-companies";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/trucking-companies` },
  openGraph: {
    url: `https://cirostack.com/industries/trucking-companies`,
    title: "Custom Software for Trucking Companies | CiroStack",
    description: "We build load board integrations, driver compliance trackers, and dispatch management platforms for trucking companies that need their software to keep up with their fleet.",
    images: [{ url: "https://cirostack.com/og/industry-pages/trucking-companies.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/trucking-companies.jpg"],
  },
};

export default function TruckingCompaniesPage() {
  return <Industry />;
}
