import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "language-learning";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/language-learning` },
  openGraph: {
    url: `https://cirostack.com/industries/language-learning`,
    title: "Custom Software for Language Learning | CiroStack",
    description: "We build spaced-repetition engines, pronunciation practice tools, and progress tracking dashboards that help language learning platforms keep students engaged and moving forward.",
    images: [{ url: "https://cirostack.com/og/industry-pages/language-learning.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/language-learning.jpg"],
  },
};

export default function LanguageLearningPage() {
  return <Industry />;
}
