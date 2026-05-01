import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "devops";
const service = servicesData[slug];

const ogImageUrl = `https://cirostack.com/api/og?service=${slug}`;

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
    description: service?.tagline ?? service?.description ?? "",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
    description: service?.tagline ?? service?.description ?? "",
    images: [ogImageUrl],
  },
};

export default function DevopsPage() {
  return <ServiceDetail />;
}
