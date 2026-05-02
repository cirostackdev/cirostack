import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "schools-and-universities";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/schools-and-universities` },
  openGraph: {
    url: `https://cirostack.com/industries/schools-and-universities`,
    title: "Custom Software for Schools & Universities | CiroStack",
    description: "We build enrollment portals, grade management systems, and campus communication tools that help schools and universities serve students better without drowning in administrative work.",
    images: [{ url: "https://cirostack.com/og/industry-pages/schools-and-universities.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/schools-and-universities.jpg"],
  },
};

export default function SchoolsAndUniversitiesPage() {
  return <Industry />;
}
