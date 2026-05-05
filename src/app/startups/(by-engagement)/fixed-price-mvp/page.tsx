import type { Metadata } from "next";
import { startupsData } from "@/data/startups-generated";
import Startup from "@/pages-src/Startup";

const slug = "fixed-price-mvp";
const startup = startupsData[slug];

export const metadata: Metadata = {
  title: startup ? `${startup.title} | CiroStack` : "Startups | CiroStack",
  description: startup?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/startups/${slug}` },
  openGraph: {
    url: `https://cirostack.com/startups/${slug}`,
    title: "Fixed-Price MVP Build - Software Development | CiroStack",
    description: startup?.tagline ?? "Fixed-price startup software development by senior engineers.",
  },
};

export default function FixedPriceMvpPage() {
  return <Startup />;
}
