import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "apps";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/apps.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "Mobile App Development | CiroStack",
    description: "Custom iOS and Android apps built by senior engineers. From MVP to scale, we handle architecture, design, and deployment, so your app works as well as your idea deserves.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mobile App Development | CiroStack",
    description: "Custom iOS and Android apps built by senior engineers. From MVP to scale, we handle architecture, design, and deployment, so your app works as well as your idea deserves.",
    images: [ogImageUrl],
  },
};

export default function AppsPage() {
  return <ServiceDetail />;
}
