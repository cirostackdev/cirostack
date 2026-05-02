import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "dental-practices";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/dental-practices` },
  openGraph: {
    url: `https://cirostack.com/industries/dental-practices`,
    title: "Custom Software for Dental Practices | CiroStack",
    description: "We build patient scheduling tools, treatment plan presenters, and insurance verification workflows that help dental practices fill chairs and reduce no-shows every week.",
    images: [{ url: "https://cirostack.com/og/industry-pages/dental-practices.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/dental-practices.jpg"],
  },
};

export default function DentalPracticesPage() {
  return <Industry />;
}
