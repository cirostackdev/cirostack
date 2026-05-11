import type { Metadata } from "next";
import { startupsData } from "@/data/startups-generated";
import Startup from "@/pages-src/Startup";

const slug = "b2b-saas";
const startup = startupsData[slug];

export const metadata: Metadata = {
  title: startup ? startup.title : "Startups",
  description: startup?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/startups/${slug}/` },
  openGraph: {
    url: `https://cirostack.com/startups/${slug}/`,
    title: "B2B SaaS - Software Development | CiroStack",
    description: startup?.tagline ?? "Fixed-price startup software development by senior engineers.",
    images: [{ url: "https://cirostack.com/og/startups/default.jpg", width: 1200, height: 630, alt: startup?.title ?? "CiroStack Startups" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "B2B SaaS - Software Development | CiroStack",
    description: startup?.tagline ?? "Fixed-price startup software development by senior engineers.",
    images: ["https://cirostack.com/og/startups/default.jpg"],
  },
};

export default function B2bSaasPage() {
  return <Startup />;
}
