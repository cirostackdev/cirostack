import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "gyms-sb";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/gyms-sb` },
  openGraph: {
    url: `https://cirostack.com/industries/gyms-sb`,
    title: "Custom Software for Gyms | CiroStack",
    description: "We build member check-in apps, class scheduling tools, and billing management systems for small gyms that care about member experience but don't have an IT department.",
    images: [{ url: "https://cirostack.com/og/industry-pages/gyms-sb.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/gyms-sb.jpg"],
  },
};

export default function GymsSbPage() {
  return <Industry />;
}
