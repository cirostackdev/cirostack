import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "business-coaching";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/business-coaching` },
  openGraph: {
    url: `https://cirostack.com/industries/business-coaching`,
    title: "Custom Software for Business Coaching | CiroStack",
    description: "We build client progress trackers, session scheduling platforms, and goal-setting dashboards for business coaches ready to scale beyond one-on-one calls and manual follow-ups.",
    images: [{ url: "https://cirostack.com/og/industry-pages/business-coaching.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/business-coaching.jpg"],
  },
};

export default function BusinessCoachingPage() {
  return <Industry />;
}
