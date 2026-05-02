import type { Metadata } from "next";
import Services from "@/pages-src/Services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom software development, mobile apps, AI automation, cloud engineering, UX/UI design, and dedicated engineering teams. Fixed-price. Senior engineers.",
  alternates: { canonical: "https://cirostack.com/services" },
  openGraph: {
    images: [{ url: "https://cirostack.com/og/pages/services.jpg", width: 1200, height: 630, alt: "CiroStack Services" }],
    url: "https://cirostack.com/services",
    title: "What We Build | Services from CiroStack",
    description:
      "Custom software, mobile apps, AI automation, cloud engineering, and UX/UI design, all delivered at a fixed price by senior engineers. See how we can help you ship.",
  },
};

export default function ServicesPage() {
  return <Services />;
}
