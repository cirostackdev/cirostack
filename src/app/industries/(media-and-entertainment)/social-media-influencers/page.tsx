import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "social-media-influencers";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/social-media-influencers` },
  openGraph: {
    url: `https://cirostack.com/industries/social-media-influencers`,
    title: "Custom Software for Social Media Influencers | CiroStack",
    description: "We build brand deal trackers, content calendars, and audience analytics dashboards for influencers and talent managers who need their own tools instead of cobbled-together spreadsheets.",
    images: [{ url: "https://cirostack.com/og/industry-pages/social-media-influencers.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/social-media-influencers.jpg"],
  },
};

export default function SocialMediaInfluencersPage() {
  return <Industry />;
}
