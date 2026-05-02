import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "education-departments";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/education-departments` },
  openGraph: {
    url: `https://cirostack.com/industries/education-departments`,
    title: "Custom Software for Education Departments — CiroStack",
    description: "We build student data systems, school performance dashboards, and grant management portals that help education departments track outcomes and allocate resources where they matter most.",
    images: [{ url: "https://cirostack.com/og/industry-pages/education-departments.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/education-departments.jpg"],
  },
};

export default function EducationDepartmentsPage() {
  return <Industry />;
}
