import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "charities";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/charities` },
  openGraph: {
    url: `https://cirostack.com/industries/charities`,
    title: "Custom Software for Charities — CiroStack",
    description: "We build donor management systems, campaign dashboards, and volunteer coordination tools for charities that want to spend less on admin and more on their mission.",
    images: [{ url: "https://cirostack.com/og/industry-pages/charities.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/charities.jpg"],
  },
};

export default function CharitiesPage() {
  return <Industry />;
}
