import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "sports-teams";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/sports-teams` },
  openGraph: {
    url: `https://cirostack.com/industries/sports-teams`,
    title: "Custom Software for Sports Teams — CiroStack",
    description: "We build roster management systems, practice scheduling tools, and performance tracking dashboards for sports teams that want their operations as organized as their game plans.",
    images: [{ url: "https://cirostack.com/og/industry-pages/sports-teams.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/sports-teams.jpg"],
  },
};

export default function SportsTeamsPage() {
  return <Industry />;
}
