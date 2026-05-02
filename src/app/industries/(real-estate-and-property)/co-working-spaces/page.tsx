import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "co-working-spaces";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/co-working-spaces` },
  openGraph: {
    url: `https://cirostack.com/industries/co-working-spaces`,
    title: "Custom Software for Co-working Spaces | CiroStack",
    description: "Our senior engineers build membership management platforms, room booking systems, and billing dashboards for co-working spaces that need tools as flexible as their tenants.",
    images: [{ url: "https://cirostack.com/og/industry-pages/co-working-spaces.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/co-working-spaces.jpg"],
  },
};

export default function CoWorkingSpacesPage() {
  return <Industry />;
}
