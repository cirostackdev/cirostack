import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "ai";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/ai.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "Generative AI Development — CiroStack",
    description: "We build AI tools that actually solve your problem — chatbots, document processors, and workflow automation powered by GPT, LangChain, and custom models. Production-ready in weeks.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Generative AI Development — CiroStack",
    description: "We build AI tools that actually solve your problem — chatbots, document processors, and workflow automation powered by GPT, LangChain, and custom models. Production-ready in weeks.",
    images: [ogImageUrl],
  },
};

export default function AiPage() {
  return <ServiceDetail />;
}
