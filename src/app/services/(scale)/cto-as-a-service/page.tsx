import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "cto-as-a-service";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/cto-as-a-service.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "CTO as a Service | CiroStack",
    description: "Senior technical leadership on demand. Architecture decisions, team hiring, investor relations, and engineering strategy — without the full-time executive hire.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CTO as a Service | CiroStack",
    description: "Senior technical leadership on demand. Architecture decisions, team hiring, investor relations, and engineering strategy — without the full-time executive hire.",
    images: [ogImageUrl],
  },
};

export default function CtoAsAServicePage() {
  return <ServiceDetail />;
}
