import type { Metadata } from "next";
import Pricing from "@/pages-src/Pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Fixed-price packages for websites, mobile apps, AI automation, and custom software. No hourly billing. No surprise invoices. Know your cost before we start.",
  alternates: { canonical: "https://cirostack.com/pricing" },
  openGraph: {
    images: [{ url: "https://cirostack.com/images/pages/hero-pricing.jpg", width: 1200, height: 630, alt: "CiroStack" }],
    url: "https://cirostack.com/pricing",
    title: "Pricing | CiroStack",
    description:
      "Fixed-price packages for websites, apps, and AI automation. Know your cost upfront — no hourly billing, no surprises.",
  },
};

export default function PricingPage() {
  return <Pricing />;
}
