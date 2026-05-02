import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "law-firms";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/law-firms` },
  openGraph: {
    url: `https://cirostack.com/industries/law-firms`,
    title: "Custom Software for Law Firms | CiroStack",
    description: "Our team builds case management platforms, document assembly tools, and client intake systems for law firms that want secure, purpose-built software instead of generic off-the-shelf products.",
    images: [{ url: "https://cirostack.com/og/industry-pages/law-firms.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/law-firms.jpg"],
  },
};

export default function LawFirmsPage() {
  return <Industry />;
}
