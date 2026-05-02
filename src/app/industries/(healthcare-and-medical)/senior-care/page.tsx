import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "senior-care";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/senior-care` },
  openGraph: {
    url: `https://cirostack.com/industries/senior-care`,
    title: "Custom Software for Senior Care — CiroStack",
    description: "Our senior engineers build resident care dashboards, family communication portals, and medication tracking systems that help senior care facilities provide attentive, accountable care every day.",
    images: [{ url: "https://cirostack.com/og/industry-pages/senior-care.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/senior-care.jpg"],
  },
};

export default function SeniorCarePage() {
  return <Industry />;
}
