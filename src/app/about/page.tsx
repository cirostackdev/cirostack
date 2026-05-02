import type { Metadata } from "next";
import About from "@/pages-src/About";

export const metadata: Metadata = {
  title: "About CiroStack",
  description: "CiroStack is a software development agency founded to bring senior engineering quality to growing businesses, without enterprise price tags or offshore gambles.",
  alternates: { canonical: "https://cirostack.com/about" },
  openGraph: {
    images: [{ url: "https://cirostack.com/og/pages/about.jpg", width: 1200, height: 630, alt: "About CiroStack" }],
    url: "https://cirostack.com/about",
    title: "About CiroStack | Senior Engineers, Fixed Prices, Real Results",
    description:
      "We started CiroStack to bring senior engineering quality to growing businesses, without enterprise price tags or offshore gambles. Meet the team behind 50+ shipped projects across fintech, healthcare, and SaaS.",
  },
};

export default function AboutPage() {
  return <About />;
}
