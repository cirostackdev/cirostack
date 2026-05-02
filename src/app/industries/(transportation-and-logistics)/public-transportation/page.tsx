import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "public-transportation";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/public-transportation` },
  openGraph: {
    url: `https://cirostack.com/industries/public-transportation`,
    title: "Custom Software for Public Transportation | CiroStack",
    description: "We build passenger information systems, route planning tools, and fleet management dashboards for public transportation agencies serving thousands of riders every day.",
    images: [{ url: "https://cirostack.com/og/industry-pages/public-transportation.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/public-transportation.jpg"],
  },
};

export default function PublicTransportationPage() {
  return <Industry />;
}
