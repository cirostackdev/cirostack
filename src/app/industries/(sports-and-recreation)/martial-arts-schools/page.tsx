import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "martial-arts-schools";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/martial-arts-schools` },
  openGraph: {
    url: `https://cirostack.com/industries/martial-arts-schools`,
    title: "Custom Software for Martial Arts Schools | CiroStack",
    description: "We build belt progression trackers, class attendance systems, and family billing portals for martial arts schools managing students of all ages and skill levels.",
    images: [{ url: "https://cirostack.com/og/industry-pages/martial-arts-schools.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/martial-arts-schools.jpg"],
  },
};

export default function MartialArtsSchoolsPage() {
  return <Industry />;
}
