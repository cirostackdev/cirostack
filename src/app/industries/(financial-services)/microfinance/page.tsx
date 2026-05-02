import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "microfinance";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/microfinance` },
  openGraph: {
    url: `https://cirostack.com/industries/microfinance`,
    title: "Custom Software for Microfinance | CiroStack",
    description: "We build loan origination platforms, repayment tracking systems, and borrower communication tools that help microfinance institutions reach more people and manage risk at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/microfinance.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/microfinance.jpg"],
  },
};

export default function MicrofinancePage() {
  return <Industry />;
}
