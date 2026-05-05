import type { Metadata } from "next";
import { startupsData } from "@/data/startups-generated";
import Startup from "@/pages-src/Startup";

const slug = "solo-founder";
const startup = startupsData[slug];

export const metadata: Metadata = {
  title: startup ? `${startup.title} | CiroStack` : "Startups | CiroStack",
  description: startup?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/startups/${slug}` },
  openGraph: {
    url: `https://cirostack.com/startups/${slug}`,
    title: "Solo Founder - Software Development | CiroStack",
    description: startup?.tagline ?? "Fixed-price startup software development by senior engineers.",
  },
};

export default function SoloFounderPage() {
  return <Startup />;
}
