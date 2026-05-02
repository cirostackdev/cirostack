import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "social-enterprises";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/social-enterprises` },
  openGraph: {
    url: `https://cirostack.com/industries/social-enterprises`,
    title: "Custom Software for Social Enterprises | CiroStack",
    description: "We create impact dashboards, beneficiary tracking tools, and custom operational platforms for social enterprises balancing mission and margin, built by senior engineers.",
    images: [{ url: "https://cirostack.com/og/industry-pages/social-enterprises.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/social-enterprises.jpg"],
  },
};

export default function SocialEnterprisesPage() {
  return <Industry />;
}
