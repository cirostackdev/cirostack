import type { Metadata } from "next";
import ThankYou from "@/pages-src/ThankYou";

export const metadata: Metadata = {
  title: "Thank You | CiroStack",
  description: "Thank you for getting in touch with CiroStack.",
  openGraph: {
    title: "We Got Your Message | CiroStack",
    description: "Thanks for reaching out. Our team will review your project details and get back to you within 24 hours with a clear proposal and a fixed price. Talk soon.",
    images: [{ url: "https://cirostack.com/og/pages/thank-you.jpg", width: 1200, height: 630, alt: "Thank You" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "We Got Your Message | CiroStack",
    description: "Thanks for reaching out. Our team will review your project details and get back to you within 24 hours with a clear proposal and a fixed price. Talk soon.",
    images: ["https://cirostack.com/og/pages/thank-you.jpg"],
  },
};

export default function ThankYouPage() {
  return <ThankYou />;
}
