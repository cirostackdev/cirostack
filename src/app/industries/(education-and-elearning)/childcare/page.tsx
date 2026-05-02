import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "childcare";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/childcare` },
  openGraph: {
    url: `https://cirostack.com/industries/childcare`,
    title: "Custom Software for Childcare | CiroStack",
    description: "We build parent communication apps, attendance trackers, and billing platforms that help childcare centers keep families informed and operations running smoothly, delivered at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/childcare.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/childcare.jpg"],
  },
};

export default function ChildcarePage() {
  return <Industry />;
}
