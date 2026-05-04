import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "dedicated-teams";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/dedicated-teams.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "Dedicated Development Teams | CiroStack",
    description: "Your engineering department, on demand. Senior developers who join your Slack, attend your standups, and ship code like full-time hires, without the recruiting overhead.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dedicated Development Teams | CiroStack",
    description: "Your engineering department, on demand. Senior developers who join your Slack, attend your standups, and ship code like full-time hires, without the recruiting overhead.",
    images: [ogImageUrl],
  },
};

export default function DedicatedTeamsPage() {
  return <ServiceDetail />;
}
