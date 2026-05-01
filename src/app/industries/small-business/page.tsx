import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Small Business Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Small Business industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/small-business" },
  openGraph: {
    url: "https://cirostack.com/industries/small-business",
    title: "Small Business Software Solutions | CiroStack",
    description:
      "Custom software for the Small Business industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/images/pages/hero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Small Business" }],
  },
};

export default function SmallBusinessPage() {
  return <IndustryCategory categoryId="small-business" />;
}
