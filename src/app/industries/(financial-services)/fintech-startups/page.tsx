import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "fintech-startups";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/fintech-startups` },
  openGraph: {
    url: `https://cirostack.com/industries/fintech-startups`,
    title: "Custom Software for Fintech Startups | CiroStack",
    description: "From payment processing interfaces to KYC verification flows and real-time transaction dashboards, we build the core product infrastructure fintech startups need to launch and scale.",
    images: [{ url: "https://cirostack.com/og/industry-pages/fintech-startups.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/fintech-startups.jpg"],
  },
};

export default function FintechStartupsPage() {
  return <Industry />;
}
