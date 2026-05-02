import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "banks-and-credit-unions";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/banks-and-credit-unions` },
  openGraph: {
    url: `https://cirostack.com/industries/banks-and-credit-unions`,
    title: "Custom Software for Banks & Credit Unions | CiroStack",
    description: "Our senior engineers build member self-service portals, loan application workflows, and internal operations dashboards that help banks and credit unions serve their communities faster.",
    images: [{ url: "https://cirostack.com/og/industry-pages/banks-and-credit-unions.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/banks-and-credit-unions.jpg"],
  },
};

export default function BanksAndCreditUnionsPage() {
  return <Industry />;
}
