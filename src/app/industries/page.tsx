import type { Metadata } from "next";
import Industries from "@/pages-src/Industries";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "CiroStack builds custom software, apps, and AI solutions for 20+ industries — from healthcare and finance to retail, logistics, and beyond. Fixed-price. Senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries" },
  openGraph: {
    url: "https://cirostack.com/industries",
    title: "Industries We Serve | CiroStack",
    description:
      "Custom software for healthcare, finance, retail, education, manufacturing, logistics, and 14 more industries. Fixed-price engagements with senior engineers.",
    images: [{ url: `https://cirostack.com/api/og?title=${encodeURIComponent(&bg=%2Fimages%2Fpages%2Fhero-industry.jpg"Industries We Serve | CiroStack")}&description=${encodeURIComponent("Custom software for healthcare, finance, retail, education, manufacturing, logistics, and 14 more industries.")}&label=${encodeURIComponent("Industries")}`, width: 1200, height: 630, alt: "CiroStack Industries" }],
  },
};

export default function IndustriesPage() {
  return <Industries />;
}
