import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "devops";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/devops.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "DevOps Consulting & Engineering — CiroStack",
    description: "Ship faster, fail safer, scale smarter. We set up CI/CD pipelines, container orchestration, monitoring, and incident response so your team can deploy multiple times a day.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevOps Consulting & Engineering — CiroStack",
    description: "Ship faster, fail safer, scale smarter. We set up CI/CD pipelines, container orchestration, monitoring, and incident response so your team can deploy multiple times a day.",
    images: [ogImageUrl],
  },
};

export default function DevopsPage() {
  return <ServiceDetail />;
}
