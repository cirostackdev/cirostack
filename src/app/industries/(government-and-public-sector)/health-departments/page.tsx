import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "health-departments";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/health-departments` },
  openGraph: {
    url: `https://cirostack.com/industries/health-departments`,
    title: "Custom Software for Health Departments | CiroStack",
    description: "We build disease surveillance dashboards, inspection tracking tools, and public health reporting systems that help health departments protect communities and respond to emerging threats.",
    images: [{ url: "https://cirostack.com/og/industry-pages/health-departments.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/health-departments.jpg"],
  },
};

export default function HealthDepartmentsPage() {
  return <Industry />;
}
