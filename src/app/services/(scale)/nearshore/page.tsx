import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "nearshore";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/nearshore.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "US Nearshore Software Development — CiroStack",
    description: "Top-tier engineering talent in your timezone, at a fraction of US hiring costs. Same-day communication, US legal contracts, and engineers who understand your culture.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "US Nearshore Software Development — CiroStack",
    description: "Top-tier engineering talent in your timezone, at a fraction of US hiring costs. Same-day communication, US legal contracts, and engineers who understand your culture.",
    images: [ogImageUrl],
  },
};

export default function NearshorePage() {
  return <ServiceDetail />;
}
