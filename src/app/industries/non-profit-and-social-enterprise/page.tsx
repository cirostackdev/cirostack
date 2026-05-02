import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Non-Profit & Social Enterprise Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Non-Profit & Social Enterprise industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/non-profit-and-social-enterprise" },
  openGraph: {
    url: "https://cirostack.com/industries/non-profit-and-social-enterprise",
    title: "Software for Non-Profits & Social Enterprises — CiroStack",
    description:
      "Donor management, volunteer coordination, and impact tracking tools for charities and non-profits. We build purpose-driven software that amplifies your mission without blowing your budget.",
    images: [{ url: "https://cirostack.com/og/industries/non-profit-and-social-enterprise.jpg", width: 1200, height: 630, alt: "CiroStack Non Profit And Social Enterprise" }],
  },
};

export default function NonProfitAndSocialEnterprisePage() {
  return <IndustryCategory categoryId="non-profit-and-social-enterprise" />;
}
