import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "fitness-and-wellness";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/fitness-and-wellness` },
  openGraph: {
    url: `https://cirostack.com/industries/fitness-and-wellness`,
    title: "Custom Software for Fitness & Wellness | CiroStack",
    description: "From class booking to membership management and workout tracking, we build apps that help fitness and wellness businesses keep members motivated and revenue predictable, fixed-price delivery.",
    images: [{ url: "https://cirostack.com/og/industry-pages/fitness-and-wellness.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/fitness-and-wellness.jpg"],
  },
};

export default function FitnessAndWellnessPage() {
  return <Industry />;
}
