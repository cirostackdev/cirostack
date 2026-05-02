import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "tattoo-shops";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/tattoo-shops` },
  openGraph: {
    url: `https://cirostack.com/industries/tattoo-shops`,
    title: "Custom Software for Tattoo Shops — CiroStack",
    description: "Our team builds artist portfolios, consultation request forms, and deposit payment systems that help tattoo shops showcase their work and book serious clients online.",
    images: [{ url: "https://cirostack.com/og/industry-pages/tattoo-shops.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/tattoo-shops.jpg"],
  },
};

export default function TattooShopsPage() {
  return <Industry />;
}
