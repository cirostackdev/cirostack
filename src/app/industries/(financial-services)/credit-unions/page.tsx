import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "credit-unions";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/credit-unions` },
  openGraph: {
    url: `https://cirostack.com/industries/credit-unions`,
    title: "Custom Software for Credit Unions | CiroStack",
    description: "We build member onboarding flows, mobile banking interfaces, and community engagement platforms that help credit unions compete with big banks while staying true to their mission.",
    images: [{ url: "https://cirostack.com/og/industry-pages/credit-unions.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/credit-unions.jpg"],
  },
};

export default function CreditUnionsPage() {
  return <Industry />;
}
