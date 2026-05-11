import type { Metadata } from "next";
import Contact from "@/pages-src/Contact";

export const metadata: Metadata = {
  title: "Contact CiroStack",
  description: "Tell us about your project. We respond within 24 hours with a scoped proposal, no vague estimates, no bait-and-switch pricing.",
  alternates: { canonical: "https://cirostack.com/contact/" },
  openGraph: {
    images: [{ url: "https://cirostack.com/og/pages/contact.jpg", width: 1200, height: 630, alt: "Contact CiroStack" }],
    url: "https://cirostack.com/contact/",
    title: "Get in Touch | Tell Us What You're Building",
    description:
      "Describe your project and we'll respond within 24 hours with a scoped proposal and a fixed price. No vague estimates, no bait-and-switch, just a clear plan to get you shipped.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get in Touch | Tell Us What You're Building",
    description: "Describe your project and we'll respond within 24 hours with a scoped proposal and a fixed price. No vague estimates, no bait-and-switch, just a clear plan to get you shipped.",
    images: ["https://cirostack.com/og/pages/contact.jpg"],
  },
};

export default function ContactPage() {
  return <Contact />;
}
