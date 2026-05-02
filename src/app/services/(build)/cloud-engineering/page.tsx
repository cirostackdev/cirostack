import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "cloud-engineering";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/cloud-engineering.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "Cloud Engineering & Infrastructure | CiroStack",
    description: "We build robust, scalable cloud infrastructure on AWS, GCP, or Azure. Infrastructure as code, CI/CD pipelines, auto-scaling, and monitoring, engineered to last.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud Engineering & Infrastructure | CiroStack",
    description: "We build robust, scalable cloud infrastructure on AWS, GCP, or Azure. Infrastructure as code, CI/CD pipelines, auto-scaling, and monitoring, engineered to last.",
    images: [ogImageUrl],
  },
};

export default function CloudEngineeringPage() {
  return <ServiceDetail />;
}
