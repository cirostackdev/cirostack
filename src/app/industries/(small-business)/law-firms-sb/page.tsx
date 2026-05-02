import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "law-firms-sb";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/law-firms-sb` },
  openGraph: {
    url: `https://cirostack.com/industries/law-firms-sb`,
    title: "Custom Software for Law Firms | CiroStack",
    description: "Our team builds client intake forms, case status portals, and document management tools for small law firms that want secure, affordable custom software built by senior engineers.",
    images: [{ url: "https://cirostack.com/og/industry-pages/law-firms-sb.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/law-firms-sb.jpg"],
  },
};

export default function LawFirmsSbPage() {
  return <Industry />;
}
