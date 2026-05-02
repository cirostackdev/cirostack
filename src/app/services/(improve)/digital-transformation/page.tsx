import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "digital-transformation";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/digital-transformation.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "Digital Transformation | CiroStack",
    description: "We modernize legacy systems, automate manual workflows, and rebuild outdated tools for the way your business works today. Practical transformation, not buzzword consulting.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Transformation | CiroStack",
    description: "We modernize legacy systems, automate manual workflows, and rebuild outdated tools for the way your business works today. Practical transformation, not buzzword consulting.",
    images: [ogImageUrl],
  },
};

export default function DigitalTransformationPage() {
  return <ServiceDetail />;
}
