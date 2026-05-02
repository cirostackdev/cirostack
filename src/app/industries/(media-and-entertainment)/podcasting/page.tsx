import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "podcasting";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/podcasting` },
  openGraph: {
    url: `https://cirostack.com/industries/podcasting`,
    title: "Custom Software for Podcasting — CiroStack",
    description: "CiroStack builds distribution dashboards, guest scheduling tools, and listener analytics platforms for podcasters and podcast networks scaling their content operations.",
    images: [{ url: "https://cirostack.com/og/industry-pages/podcasting.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/podcasting.jpg"],
  },
};

export default function PodcastingPage() {
  return <Industry />;
}
