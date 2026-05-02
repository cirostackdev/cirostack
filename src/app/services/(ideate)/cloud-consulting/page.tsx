import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "cloud-consulting";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/cloud-consulting.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "Cloud Consulting & Strategy | CiroStack",
    description: "Strategic cloud guidance from engineers who have migrated dozens of production workloads. We help you pick the right stack, plan the migration, and avoid costly mistakes.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud Consulting & Strategy | CiroStack",
    description: "Strategic cloud guidance from engineers who have migrated dozens of production workloads. We help you pick the right stack, plan the migration, and avoid costly mistakes.",
    images: [ogImageUrl],
  },
};

export default function CloudConsultingPage() {
  return <ServiceDetail />;
}
