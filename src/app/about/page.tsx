import type { Metadata } from "next";
import About from "@/pages-src/About";

export const metadata: Metadata = {
  title: "About CiroStack",
  description:
    "CiroStack is a software development agency founded to bring senior engineering quality to growing businesses — without enterprise price tags or offshore gambles.",
  alternates: { canonical: "https://cirostack.com/about" },
  openGraph: {
    images: [{ url: "https://cirostack.com/images/pages/hero-about.jpg", width: 1200, height: 630, alt: "CiroStack" }],
    url: "https://cirostack.com/about",
    title: "About CiroStack",
    description:
      "Senior engineers, fixed-price engagements, and a track record across fintech, healthcare, e-commerce, and SaaS. Learn who we are and how we work.",
  },
};

export default function AboutPage() {
  return <About />;
}
