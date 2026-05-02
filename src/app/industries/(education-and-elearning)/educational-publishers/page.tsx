import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "educational-publishers";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/educational-publishers` },
  openGraph: {
    url: `https://cirostack.com/industries/educational-publishers`,
    title: "Custom Software for Educational Publishers | CiroStack",
    description: "From digital textbook platforms to interactive exercise builders and analytics dashboards, we build tools that help educational publishers bring their content online and track engagement.",
    images: [{ url: "https://cirostack.com/og/industry-pages/educational-publishers.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/educational-publishers.jpg"],
  },
};

export default function EducationalPublishersPage() {
  return <Industry />;
}
