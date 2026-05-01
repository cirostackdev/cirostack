import type { Metadata } from "next";
import ThankYou from "@/pages-src/ThankYou";

export const metadata: Metadata = {
  title: "Thank You | CiroStack",
  description: "Thank you for getting in touch with CiroStack.",
  openGraph: {
    title: "Thank You | CiroStack",
    description: "Thank you for getting in touch. We'll be in touch within 24 hours.",
    images: [{ url: "https://cirostack.com/api/og?bg=/images/pages/hero-generic.jpg", width: 1200, height: 630, alt: "Thank You" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thank You | CiroStack",
    description: "Thank you for getting in touch. We'll be in touch within 24 hours.",
    images: ["https://cirostack.com/api/og?bg=/images/pages/hero-generic.jpg"],
  },
};

export default function ThankYouPage() {
  return <ThankYou />;
}
