import type { Metadata } from "next";
import Index from "@/pages-src/Index";

export const metadata: Metadata = {
  title: "CiroStack — Custom Software, Apps & AI for Growing Businesses",
  description:
    "We build websites, mobile apps, and AI automation solutions for growing businesses. Fixed-price engagements, senior engineers, delivery in weeks — not months.",
  alternates: { canonical: "https://cirostack.com" },
  openGraph: {
    url: "https://cirostack.com",
    title: "CiroStack — Custom Software, Apps & AI for Growing Businesses",
    description:
      "We build websites, mobile apps, and AI automation solutions for growing businesses. Fixed-price engagements, senior engineers, delivery in weeks.",
    images: [{ url: "https://cirostack.com/images/pages/hero-bg.jpg", width: 1200, height: 630, alt: "CiroStack" }],
  },
};

export default function HomePage() {
  return <Index />;
}
