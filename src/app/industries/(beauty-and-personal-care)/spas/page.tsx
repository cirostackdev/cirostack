import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "spas";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/spas` },
  openGraph: {
    url: `https://cirostack.com/industries/spas`,
    title: "Custom Software for Spas | CiroStack",
    description: "We build room and therapist scheduling tools, package upsell flows, and guest experience portals that help spas fill every time slot and delight every visitor, fixed-price delivery.",
    images: [{ url: "https://cirostack.com/og/industry-pages/spas.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/spas.jpg"],
  },
};

export default function SpasPage() {
  return <Industry />;
}
