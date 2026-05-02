import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Automotive Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Automotive industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/automotive" },
  openGraph: {
    url: "https://cirostack.com/industries/automotive",
    title: "Software for Automotive Businesses | CiroStack",
    description:
      "Custom apps and software for dealerships, repair shops, fleet managers, and automotive retailers. We help automotive businesses sell more, service faster, and run leaner.",
    images: [{ url: "https://cirostack.com/og/industries/automotive.jpg", width: 1200, height: 630, alt: "CiroStack Automotive" }],
  },
};

export default function AutomotivePage() {
  return <IndustryCategory categoryId="automotive" />;
}
