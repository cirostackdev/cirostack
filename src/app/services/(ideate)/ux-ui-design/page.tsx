import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "ux-ui-design";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/ux-ui-design.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "UX & UI Design That Converts — CiroStack",
    description: "Interfaces designed to delight users and drive conversions. We craft wireframes, prototypes, and polished designs that make complex products feel simple and intuitive.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UX & UI Design That Converts — CiroStack",
    description: "Interfaces designed to delight users and drive conversions. We craft wireframes, prototypes, and polished designs that make complex products feel simple and intuitive.",
    images: [ogImageUrl],
  },
};

export default function UxUiDesignPage() {
  return <ServiceDetail />;
}
