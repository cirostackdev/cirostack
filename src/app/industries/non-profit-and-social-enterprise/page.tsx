import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Non-Profit & Social Enterprise Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Non-Profit & Social Enterprise industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/non-profit-and-social-enterprise" },
  openGraph: {
    url: "https://cirostack.com/industries/non-profit-and-social-enterprise",
    title: "Non-Profit & Social Enterprise Software Solutions | CiroStack",
    description:
      "Custom software for the Non-Profit & Social Enterprise industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/images/pages/hero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Non-Profit & Social Enterprise" }],
  },
};

export default function NonProfitAndSocialEnterprisePage() {
  return <IndustryCategory categoryId="non-profit-and-social-enterprise" />;
}
