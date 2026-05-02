import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "tutoring-services";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/tutoring-services` },
  openGraph: {
    url: `https://cirostack.com/industries/tutoring-services`,
    title: "Custom Software for Tutoring Services — CiroStack",
    description: "From tutor-student matching to session scheduling and progress reports for parents, we build platforms that help tutoring services scale without losing the personal touch — all fixed-price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/tutoring-services.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/tutoring-services.jpg"],
  },
};

export default function TutoringServicesPage() {
  return <Industry />;
}
