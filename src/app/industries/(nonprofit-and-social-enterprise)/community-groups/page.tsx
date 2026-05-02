import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "community-groups";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/community-groups` },
  openGraph: {
    url: `https://cirostack.com/industries/community-groups`,
    title: "Custom Software for Community Groups | CiroStack",
    description: "Our team builds member directories, event management tools, and communication platforms for community groups that have outgrown email chains and shared docs.",
    images: [{ url: "https://cirostack.com/og/industry-pages/community-groups.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/community-groups.jpg"],
  },
};

export default function CommunityGroupsPage() {
  return <Industry />;
}
