import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "skincare";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/skincare` },
  openGraph: {
    url: `https://cirostack.com/industries/skincare`,
    title: "Custom Software for Skincare — CiroStack",
    description: "From routine-builder quizzes to subscription management and ingredient databases, we build digital products that help skincare brands connect with customers and drive loyalty.",
    images: [{ url: "https://cirostack.com/og/industry-pages/skincare.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/skincare.jpg"],
  },
};

export default function SkincarePage() {
  return <Industry />;
}
