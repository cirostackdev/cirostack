import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "recruiting-agencies";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/recruiting-agencies` },
  openGraph: {
    url: `https://cirostack.com/industries/recruiting-agencies`,
    title: "Custom Software for Recruiting Agencies | CiroStack",
    description: "CiroStack builds applicant tracking systems, client portals, and placement analytics dashboards for recruiting agencies scaling their pipeline, delivered at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/recruiting-agencies.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/recruiting-agencies.jpg"],
  },
};

export default function RecruitingAgenciesPage() {
  return <Industry />;
}
