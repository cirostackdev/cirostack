import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Financial Services Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Financial Services industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/financial-services" },
  openGraph: {
    url: "https://cirostack.com/industries/financial-services",
    title: "Software for Financial Services — CiroStack",
    description:
      "Secure, compliant software for banks, fintechs, insurance companies, and investment firms. We build platforms that handle real money with the security and reliability your clients expect.",
    images: [{ url: "https://cirostack.com/og/industries/financial-services.jpg", width: 1200, height: 630, alt: "CiroStack Financial Services" }],
  },
};

export default function FinancialServicesPage() {
  return <IndustryCategory categoryId="financial-services" />;
}
