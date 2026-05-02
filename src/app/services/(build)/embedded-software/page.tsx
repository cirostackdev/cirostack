import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "embedded-software";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/embedded-software.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "Embedded Software & Firmware | CiroStack",
    description: "Reliable firmware for connected devices and IoT products. We write deterministic, power-efficient code and build secure OTA update pipelines for hardware that runs for years.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Embedded Software & Firmware | CiroStack",
    description: "Reliable firmware for connected devices and IoT products. We write deterministic, power-efficient code and build secure OTA update pipelines for hardware that runs for years.",
    images: [ogImageUrl],
  },
};

export default function EmbeddedSoftwarePage() {
  return <ServiceDetail />;
}
