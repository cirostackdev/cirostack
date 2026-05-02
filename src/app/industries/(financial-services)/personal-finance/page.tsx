import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "personal-finance";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/personal-finance` },
  openGraph: {
    url: `https://cirostack.com/industries/personal-finance`,
    title: "Custom Software for Personal Finance — CiroStack",
    description: "We build budgeting apps, savings goal trackers, and financial health dashboards that help personal finance companies give users clear, actionable insight into their money.",
    images: [{ url: "https://cirostack.com/og/industry-pages/personal-finance.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/personal-finance.jpg"],
  },
};

export default function PersonalFinancePage() {
  return <Industry />;
}
