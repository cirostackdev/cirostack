import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "backend-development";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/backend-development.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "Backend Development | CiroStack",
    description: "Robust APIs, secure databases, and server-side systems engineered to power your product reliably at any scale.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Backend Development | CiroStack",
    description: "Robust APIs, secure databases, and server-side systems engineered to power your product reliably at any scale.",
    images: [ogImageUrl],
  },
};

export default function BackendDevelopmentPage() {
  return <ServiceDetail />;
}
