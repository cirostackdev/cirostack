import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "consultants";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/consultants` },
  openGraph: {
    url: `https://cirostack.com/industries/consultants`,
    title: "Custom Software for Consultants | CiroStack",
    description: "Our senior engineers build proposal generators, client dashboards, and project tracking tools for independent consultants who need their own platform instead of a patchwork of apps.",
    images: [{ url: "https://cirostack.com/og/industry-pages/consultants.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/consultants.jpg"],
  },
};

export default function ConsultantsPage() {
  return <Industry />;
}
