import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "frontend-development";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/frontend-development.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}/` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}/`,
    title: "Frontend Development | CiroStack",
    description: "Pixel-perfect, blazing-fast interfaces built with React and Next.js that convert visitors into customers. No templates, no shortcuts — pure engineering.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontend Development | CiroStack",
    description: "Pixel-perfect, blazing-fast interfaces built with React and Next.js that convert visitors into customers. No templates, no shortcuts — pure engineering.",
    images: [ogImageUrl],
  },
};

export default function FrontendDevelopmentPage() {
  return <ServiceDetail />;
}
