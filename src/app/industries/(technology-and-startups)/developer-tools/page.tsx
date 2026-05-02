import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "developer-tools";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/developer-tools` },
  openGraph: {
    url: `https://cirostack.com/industries/developer-tools`,
    title: "Custom Software for Developer Tools | CiroStack",
    description: "We create CLI interfaces, plugin ecosystems, and documentation portals for developer tool companies that know their users expect great tooling, because they build it too.",
    images: [{ url: "https://cirostack.com/og/industry-pages/developer-tools.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/developer-tools.jpg"],
  },
};

export default function DeveloperToolsPage() {
  return <Industry />;
}
