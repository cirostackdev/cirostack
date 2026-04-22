import type { Metadata } from "next";
import Contact from "@/pages-src/Contact";

export const metadata: Metadata = {
  title: "Contact CiroStack",
  description:
    "Tell us about your project. We respond within 24 hours with a scoped proposal — no vague estimates, no bait-and-switch pricing.",
  alternates: { canonical: "https://cirostack.com/contact" },
  openGraph: {
    images: [{ url: "https://cirostack.com/images/pages/hero-contact.jpg", width: 1200, height: 630, alt: "CiroStack" }],
    url: "https://cirostack.com/contact",
    title: "Contact CiroStack",
    description:
      "Tell us about your project. We respond within 24 hours with a scoped proposal — no vague estimates, no bait-and-switch pricing.",
  },
};

export default function ContactPage() {
  return <Contact />;
}
