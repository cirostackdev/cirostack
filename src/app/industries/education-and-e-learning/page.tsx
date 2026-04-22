import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Education & E-Learning Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Education & E-Learning industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/education-and-e-learning" },
  openGraph: {
    url: "https://cirostack.com/industries/education-and-e-learning",
    title: "Education & E-Learning Software Solutions | CiroStack",
    description:
      "Custom software for the Education & E-Learning industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/images/pages/hero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Education & E-Learning" }],
  },
};

export default function EducationAndELearningPage() {
  return <IndustryCategory categoryId="education-and-e-learning" />;
}
