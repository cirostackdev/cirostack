import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "railway-companies";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/railway-companies` },
  openGraph: {
    url: `https://cirostack.com/industries/railway-companies`,
    title: "Custom Software for Railway Companies — CiroStack",
    description: "CiroStack builds scheduling optimization tools, maintenance tracking systems, and passenger booking platforms for railway companies running complex timetables across large networks.",
    images: [{ url: "https://cirostack.com/og/industry-pages/railway-companies.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/railway-companies.jpg"],
  },
};

export default function RailwayCompaniesPage() {
  return <Industry />;
}
