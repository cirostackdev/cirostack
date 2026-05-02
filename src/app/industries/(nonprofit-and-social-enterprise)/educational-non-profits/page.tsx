import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "educational-non-profits";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/educational-non-profits` },
  openGraph: {
    url: `https://cirostack.com/industries/educational-non-profits`,
    title: "Custom Software for Educational Non-Profits | CiroStack",
    description: "We create student tracking systems, grant reporting dashboards, and program management tools for educational non-profits, delivered by senior engineers who care about the work.",
    images: [{ url: "https://cirostack.com/og/industry-pages/educational-non-profits.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/educational-non-profits.jpg"],
  },
};

export default function EducationalNonProfitsPage() {
  return <Industry />;
}
