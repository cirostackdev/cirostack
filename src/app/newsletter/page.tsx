import type { Metadata } from "next";
import Newsletter from "@/pages-src/Newsletter";

export const metadata: Metadata = {
  title: "Newsletter | CiroStack",
  description: "Subscribe to the CiroStack newsletter for software insights and updates.",
  alternates: { canonical: "https://cirostack.com/newsletter" },
  openGraph: {
    url: "https://cirostack.com/newsletter",
    title: "Newsletter | CiroStack",
    description: "Subscribe to the CiroStack newsletter for software insights, case studies, and engineering updates.",
    images: [{ url: "https://cirostack.com/api/og?bg=/images/pages/hero-newsletter.jpg", width: 1200, height: 630, alt: "CiroStack Newsletter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Newsletter | CiroStack",
    description: "Subscribe to the CiroStack newsletter for software insights, case studies, and engineering updates.",
    images: ["https://cirostack.com/api/og?bg=/images/pages/hero-newsletter.jpg"],
  },
};

export default function NewsletterPage() {
  return <Newsletter />;
}
