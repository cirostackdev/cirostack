import type { Metadata } from "next";
import Industries from "@/pages-src/Industries";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description: "CiroStack builds custom software, apps, and AI solutions for 20+ industries, from healthcare and finance to retail, logistics, and beyond. Fixed-price. Senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries" },
  openGraph: {
    url: "https://cirostack.com/industries",
    title: "Industries We Build For | CiroStack",
    description:
      "We build custom software for 20+ industries, healthcare, finance, retail, education, manufacturing, logistics, and more. Every project is fixed-price and built by senior engineers who understand your vertical.",
    images: [{ url: "https://cirostack.com/og/pages/industries.jpg", width: 1200, height: 630, alt: "CiroStack Industries" }],
  },
};

export default function IndustriesPage() {
  return <Industries />;
}
