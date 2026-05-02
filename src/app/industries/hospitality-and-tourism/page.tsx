import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Hospitality & Tourism Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Hospitality & Tourism industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/hospitality-and-tourism" },
  openGraph: {
    url: "https://cirostack.com/industries/hospitality-and-tourism",
    title: "Software for Hospitality & Tourism | CiroStack",
    description:
      "Booking engines, guest management tools, and operations platforms for hotels, restaurants, travel agencies, and tour operators. We build hospitality software that creates memorable guest experiences.",
    images: [{ url: "https://cirostack.com/og/industries/hospitality-and-tourism.jpg", width: 1200, height: 630, alt: "CiroStack Hospitality And Tourism" }],
  },
};

export default function HospitalityAndTourismPage() {
  return <IndustryCategory categoryId="hospitality-and-tourism" />;
}
