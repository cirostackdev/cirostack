import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "law-firms-legal";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/law-firms-legal` },
  openGraph: {
    url: `https://cirostack.com/industries/law-firms-legal`,
    title: "Custom Software for Law Firms | CiroStack",
    description: "We build matter management platforms, time tracking tools, and client intake portals that help law firms operate more efficiently and deliver better service to every client they represent.",
    images: [{ url: "https://cirostack.com/og/industry-pages/law-firms-legal.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/law-firms-legal.jpg"],
  },
};

export default function LawFirmsLegalPage() {
  return <Industry />;
}
