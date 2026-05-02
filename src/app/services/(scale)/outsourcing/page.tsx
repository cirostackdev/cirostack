import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "outsourcing";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/outsourcing.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "Software Development Outsourcing — CiroStack",
    description: "Entire product teams, expertly managed. We handle recruiting, onboarding, and day-to-day management so you get a high-performing dev team without the HR overhead.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Development Outsourcing — CiroStack",
    description: "Entire product teams, expertly managed. We handle recruiting, onboarding, and day-to-day management so you get a high-performing dev team without the HR overhead.",
    images: [ogImageUrl],
  },
};

export default function OutsourcingPage() {
  return <ServiceDetail />;
}
