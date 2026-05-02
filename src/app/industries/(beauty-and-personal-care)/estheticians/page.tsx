import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "estheticians";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/estheticians` },
  openGraph: {
    url: `https://cirostack.com/industries/estheticians`,
    title: "Custom Software for Estheticians | CiroStack",
    description: "Booking systems, client skin profiles, and automated follow-up reminders, we build practice management software that lets estheticians focus on their clients, not their calendar.",
    images: [{ url: "https://cirostack.com/og/industry-pages/estheticians.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/estheticians.jpg"],
  },
};

export default function EstheticiansPage() {
  return <Industry />;
}
