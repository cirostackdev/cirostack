import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "website-development";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/website-development.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}/` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}/`,
    title: "Website Development | CiroStack",
    description: "Custom websites designed and built to rank, convert, and grow your business. No templates, no shortcuts — delivered in weeks.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Development | CiroStack",
    description: "Custom websites designed and built to rank, convert, and grow your business. No templates, no shortcuts — delivered in weeks.",
    images: [ogImageUrl],
  },
};

export default function WebsiteDevelopmentPage() {
  return <ServiceDetail />;
}
