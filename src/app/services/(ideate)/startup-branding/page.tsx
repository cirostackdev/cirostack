import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "startup-branding";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/startup-branding.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}/` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}/`,
    title: "Startup Branding: Strategy, Identity & Launch | CiroStack",
    description:
      "Founder-speed startup branding: positioning, naming, logo system, brand guidelines, and a launch-ready website rollout. Senior team, fixed scope, no scope drift.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Startup Branding" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Branding: Strategy, Identity & Launch | CiroStack",
    description:
      "Founder-speed startup branding: positioning, naming, logo system, brand guidelines, and a launch-ready website rollout. Senior team, fixed scope, no scope drift.",
    images: [ogImageUrl],
  },
};

export default function StartupBrandingPage() {
  return <ServiceDetail />;
}
