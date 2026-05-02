import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "nail-salons";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/nail-salons` },
  openGraph: {
    url: `https://cirostack.com/industries/nail-salons`,
    title: "Custom Software for Nail Salons — CiroStack",
    description: "Our senior engineers build appointment schedulers, service menu builders, and tip-splitting tools that help nail salons run smoothly from open to close every single day.",
    images: [{ url: "https://cirostack.com/og/industry-pages/nail-salons.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/nail-salons.jpg"],
  },
};

export default function NailSalonsPage() {
  return <Industry />;
}
