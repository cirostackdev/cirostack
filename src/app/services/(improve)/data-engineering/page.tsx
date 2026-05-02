import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "data-engineering";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/data-engineering.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "Data Engineering & Data Science — CiroStack",
    description: "We turn raw data into your competitive advantage. Custom pipelines, data warehouses, and executive dashboards that give you real-time visibility into what matters most.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Engineering & Data Science — CiroStack",
    description: "We turn raw data into your competitive advantage. Custom pipelines, data warehouses, and executive dashboards that give you real-time visibility into what matters most.",
    images: [ogImageUrl],
  },
};

export default function DataEngineeringPage() {
  return <ServiceDetail />;
}
