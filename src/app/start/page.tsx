import type { Metadata } from "next";
import Start from "@/pages-src/Start";

export const metadata: Metadata = {
  title: "Start a Project",
  description: "Tell us what you're building. Get a fixed-price proposal from CiroStack within 24 hours — no vague estimates, no bait-and-switch pricing.",
  alternates: { canonical: "https://cirostack.com/start/" },
  openGraph: {
    url: "https://cirostack.com/start/",
    title: "Start Your Project | Get a Fixed-Price Proposal",
    description: "Describe what you're building and we'll respond within 24 hours with a scoped, fixed-price proposal. Senior engineers, no surprises.",
    images: [{ url: "https://cirostack.com/og/pages/contact.jpg", width: 1200, height: 630, alt: "Start a Project with CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Start Your Project | Get a Fixed-Price Proposal",
    description: "Describe what you're building and we'll respond within 24 hours with a scoped, fixed-price proposal. Senior engineers, no surprises.",
    images: ["https://cirostack.com/og/pages/contact.jpg"],
  },
};

export default function StartPage() {
  return <Start />;
}
