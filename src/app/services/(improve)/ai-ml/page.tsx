import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "ai-ml";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/ai-ml.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "AI & Machine Learning Development — CiroStack",
    description: "From proof-of-concept to production ML systems. We build, train, deploy, and monitor machine learning models that deliver real business value — not just impressive demos.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI & Machine Learning Development — CiroStack",
    description: "From proof-of-concept to production ML systems. We build, train, deploy, and monitor machine learning models that deliver real business value — not just impressive demos.",
    images: [ogImageUrl],
  },
};

export default function AiMlPage() {
  return <ServiceDetail />;
}
