import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Education & E-Learning Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Education & E-Learning industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/education-and-e-learning" },
  openGraph: {
    url: "https://cirostack.com/industries/education-and-e-learning",
    title: "Software for Education & E-Learning | CiroStack",
    description:
      "Learning platforms, student portals, and course management tools for schools, bootcamps, and online educators. We build ed-tech that actually helps people learn and complete courses.",
    images: [{ url: "https://cirostack.com/og/industries/education-and-e-learning.jpg", width: 1200, height: 630, alt: "CiroStack Education And E Learning" }],
  },
};

export default function EducationAndELearningPage() {
  return <IndustryCategory categoryId="education-and-e-learning" />;
}
