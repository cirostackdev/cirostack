import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "automotive-detailing";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/automotive-detailing` },
  openGraph: {
    url: `https://cirostack.com/industries/automotive-detailing`,
    title: "Custom Software for Automotive Detailing — CiroStack",
    description: "We build booking platforms, package builders, and customer loyalty apps that help automotive detailing businesses fill their calendars and keep clients coming back.",
    images: [{ url: "https://cirostack.com/og/industry-pages/automotive-detailing.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/automotive-detailing.jpg"],
  },
};

export default function AutomotiveDetailingPage() {
  return <Industry />;
}
