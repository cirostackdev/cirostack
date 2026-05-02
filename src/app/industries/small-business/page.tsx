import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Small Business Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Small Business industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/small-business" },
  openGraph: {
    url: "https://cirostack.com/industries/small-business",
    title: "Software for Small Businesses — CiroStack",
    description:
      "Websites, booking tools, and business apps built for small businesses that need professional-grade software without enterprise-grade budgets. Fixed-price builds with senior engineers.",
    images: [{ url: "https://cirostack.com/og/industries/small-business.jpg", width: 1200, height: 630, alt: "CiroStack Small Business" }],
  },
};

export default function SmallBusinessPage() {
  return <IndustryCategory categoryId="small-business" />;
}
