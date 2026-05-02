import type { Metadata } from "next";
import Newsletter from "@/pages-src/Newsletter";

export const metadata: Metadata = {
  title: "Newsletter | CiroStack",
  description: "Subscribe to the CiroStack newsletter for software insights and updates.",
  alternates: { canonical: "https://cirostack.com/newsletter" },
  openGraph: {
    url: "https://cirostack.com/newsletter",
    title: "The CiroStack Newsletter — Software Insights for Builders",
    description: "Practical engineering advice, project case studies, and founder-friendly tech breakdowns delivered to your inbox. No fluff, no spam — just things worth reading.",
    images: [{ url: "https://cirostack.com/og/pages/newsletter.jpg", width: 1200, height: 630, alt: "CiroStack Newsletter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The CiroStack Newsletter — Software Insights for Builders",
    description: "Practical engineering advice, project case studies, and founder-friendly tech breakdowns delivered to your inbox. No fluff, no spam — just things worth reading.",
    images: ["https://cirostack.com/og/pages/newsletter.jpg"],
  },
};

export default function NewsletterPage() {
  return <Newsletter />;
}
