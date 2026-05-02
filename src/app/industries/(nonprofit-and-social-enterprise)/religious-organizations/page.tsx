import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "religious-organizations";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/religious-organizations` },
  openGraph: {
    url: `https://cirostack.com/industries/religious-organizations`,
    title: "Custom Software for Religious Organizations — CiroStack",
    description: "CiroStack builds member management systems, event calendars, donation tracking tools, and communication platforms for congregations and religious organizations of every size.",
    images: [{ url: "https://cirostack.com/og/industry-pages/religious-organizations.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/religious-organizations.jpg"],
  },
};

export default function ReligiousOrganizationsPage() {
  return <Industry />;
}
