import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "ride-sharing";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/ride-sharing` },
  openGraph: {
    url: `https://cirostack.com/industries/ride-sharing`,
    title: "Custom Software for Ride Sharing — CiroStack",
    description: "We build driver matching algorithms, fare calculation engines, and rider-facing apps for ride-sharing companies — built by senior engineers who handle the real-time complexity.",
    images: [{ url: "https://cirostack.com/og/industry-pages/ride-sharing.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/ride-sharing.jpg"],
  },
};

export default function RideSharingPage() {
  return <Industry />;
}
