import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "coding-bootcamps";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/coding-bootcamps` },
  openGraph: {
    url: `https://cirostack.com/industries/coding-bootcamps`,
    title: "Custom Software for Coding Bootcamps — CiroStack",
    description: "Our team builds student progress dashboards, curriculum management tools, and job placement trackers that help coding bootcamps deliver results and prove outcomes to prospective students.",
    images: [{ url: "https://cirostack.com/og/industry-pages/coding-bootcamps.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/coding-bootcamps.jpg"],
  },
};

export default function CodingBootcampsPage() {
  return <Industry />;
}
