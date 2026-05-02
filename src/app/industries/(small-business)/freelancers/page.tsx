import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "freelancers";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/freelancers` },
  openGraph: {
    url: `https://cirostack.com/industries/freelancers`,
    title: "Custom Software for Freelancers — CiroStack",
    description: "CiroStack builds portfolio sites, contract generators, and time-tracking dashboards for freelancers who want to run a real business — delivered at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/freelancers.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/freelancers.jpg"],
  },
};

export default function FreelancersPage() {
  return <Industry />;
}
