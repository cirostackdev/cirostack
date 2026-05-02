import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "civil-engineering";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/civil-engineering` },
  openGraph: {
    url: `https://cirostack.com/industries/civil-engineering`,
    title: "Custom Software for Civil Engineering — CiroStack",
    description: "We build project tracking platforms, permit management tools, and field inspection apps that help civil engineering firms stay on schedule and on budget across every job site.",
    images: [{ url: "https://cirostack.com/og/industry-pages/civil-engineering.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/civil-engineering.jpg"],
  },
};

export default function CivilEngineeringPage() {
  return <Industry />;
}
