import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "public-safety";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/public-safety` },
  openGraph: {
    url: `https://cirostack.com/industries/public-safety`,
    title: "Custom Software for Public Safety — CiroStack",
    description: "We build incident reporting tools, dispatch coordination dashboards, and community notification systems that help public safety agencies respond faster and keep residents informed.",
    images: [{ url: "https://cirostack.com/og/industry-pages/public-safety.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/public-safety.jpg"],
  },
};

export default function PublicSafetyPage() {
  return <Industry />;
}
