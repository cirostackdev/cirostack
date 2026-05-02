import type { Metadata } from "next";
import OurCulture from "@/pages-src/OurCulture";

export const metadata: Metadata = {
  title: "Our Culture | CiroStack",
  description: "The values, rituals, and principles that make CiroStack a great place to build.",
  alternates: { canonical: "https://cirostack.com/our-culture" },
  openGraph: {
    url: "https://cirostack.com/our-culture",
    title: "How We Work | Culture at CiroStack",
    description: "Remote-first, quality-obsessed, and built around trust. Here's how we structure our team, make decisions, and deliver great software without the corporate overhead.",
    images: [{ url: "https://cirostack.com/og/pages/our-culture.jpg", width: 1200, height: 630, alt: "CiroStack Culture" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How We Work | Culture at CiroStack",
    description: "Remote-first, quality-obsessed, and built around trust. Here's how we structure our team, make decisions, and deliver great software without the corporate overhead.",
    images: ["https://cirostack.com/og/pages/our-culture.jpg"],
  },
};

export default function OurCulturePage() {
  return <OurCulture />;
}
