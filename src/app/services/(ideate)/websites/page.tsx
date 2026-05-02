import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "websites";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/websites.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "Custom Website Development — CiroStack",
    description: "We build fast, beautiful websites that drive real business results. Custom-designed, conversion-optimized, and shipped in weeks — not months. No templates, no shortcuts.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Website Development — CiroStack",
    description: "We build fast, beautiful websites that drive real business results. Custom-designed, conversion-optimized, and shipped in weeks — not months. No templates, no shortcuts.",
    images: [ogImageUrl],
  },
};

export default function WebsitesPage() {
  return <ServiceDetail />;
}
