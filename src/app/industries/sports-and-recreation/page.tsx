import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Sports & Recreation Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Sports & Recreation industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/sports-and-recreation" },
  openGraph: {
    url: "https://cirostack.com/industries/sports-and-recreation",
    title: "Software for Sports & Recreation — CiroStack",
    description:
      "Member management, class scheduling, and league tracking tools for gyms, studios, and sports organizations. We build software that keeps your members engaged and your operations running smooth.",
    images: [{ url: "https://cirostack.com/og/industries/sports-and-recreation.jpg", width: 1200, height: 630, alt: "CiroStack Sports And Recreation" }],
  },
};

export default function SportsAndRecreationPage() {
  return <IndustryCategory categoryId="sports-and-recreation" />;
}
