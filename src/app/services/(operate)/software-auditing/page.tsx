import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "software-auditing";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/software-auditing.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "Software Auditing & Code Review — CiroStack",
    description: "Know what you own and what is at risk. We audit your codebase for technical debt, security gaps, performance issues, and architecture problems — then give you a clear fix plan.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Auditing & Code Review — CiroStack",
    description: "Know what you own and what is at risk. We audit your codebase for technical debt, security gaps, performance issues, and architecture problems — then give you a clear fix plan.",
    images: [ogImageUrl],
  },
};

export default function SoftwareAuditingPage() {
  return <ServiceDetail />;
}
