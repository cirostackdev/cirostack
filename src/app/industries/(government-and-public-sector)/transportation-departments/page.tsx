import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "transportation-departments";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/transportation-departments` },
  openGraph: {
    url: `https://cirostack.com/industries/transportation-departments`,
    title: "Custom Software for Transportation Departments — CiroStack",
    description: "We build traffic monitoring dashboards, project tracking tools, and public transit planning systems that help transportation departments move people and freight more reliably.",
    images: [{ url: "https://cirostack.com/og/industry-pages/transportation-departments.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/transportation-departments.jpg"],
  },
};

export default function TransportationDepartmentsPage() {
  return <Industry />;
}
