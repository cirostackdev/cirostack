import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "automation-testing";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/automation-testing.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "Automation Testing & QA | CiroStack",
    description: "Ship with confidence every time. We build automated test suites, CI pipelines, and QA frameworks that catch bugs before your users do, so you can deploy without fear.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automation Testing & QA | CiroStack",
    description: "Ship with confidence every time. We build automated test suites, CI pipelines, and QA frameworks that catch bugs before your users do, so you can deploy without fear.",
    images: [ogImageUrl],
  },
};

export default function AutomationTestingPage() {
  return <ServiceDetail />;
}
