import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "beauty-clinics";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/beauty-clinics` },
  openGraph: {
    url: `https://cirostack.com/industries/beauty-clinics`,
    title: "Custom Software for Beauty Clinics — CiroStack",
    description: "Our team builds patient intake forms, treatment tracking dashboards, and before-and-after photo galleries that help beauty clinics deliver better consultations and follow-ups.",
    images: [{ url: "https://cirostack.com/og/industry-pages/beauty-clinics.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/beauty-clinics.jpg"],
  },
};

export default function BeautyClinicsPage() {
  return <Industry />;
}
