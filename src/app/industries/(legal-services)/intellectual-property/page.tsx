import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "intellectual-property";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/intellectual-property` },
  openGraph: {
    url: `https://cirostack.com/industries/intellectual-property`,
    title: "Custom Software for Intellectual Property — CiroStack",
    description: "We build patent portfolio dashboards, trademark monitoring tools, and deadline management systems that help intellectual property firms protect their clients' innovations and brands.",
    images: [{ url: "https://cirostack.com/og/industry-pages/intellectual-property.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/intellectual-property.jpg"],
  },
};

export default function IntellectualPropertyPage() {
  return <Industry />;
}
