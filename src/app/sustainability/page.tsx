import type { Metadata } from "next";
import Sustainability from "@/pages-src/Sustainability";

export const metadata: Metadata = {
  title: "Sustainability | CiroStack",
  description: "CiroStack's commitment to sustainable software development and responsible tech.",
  alternates: { canonical: "https://cirostack.com/sustainability" },
  openGraph: {
    url: "https://cirostack.com/sustainability",
    title: "Sustainability | CiroStack",
    description: "CiroStack's commitment to sustainable software development and responsible tech.",
    images: [{ url: "https://cirostack.com/og/pages/sustainability.jpg", width: 1200, height: 630, alt: "CiroStack Sustainability" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sustainability | CiroStack",
    description: "CiroStack's commitment to sustainable software development and responsible tech.",
    images: ["https://cirostack.com/og/pages/sustainability.jpg"],
  },
};

export default function SustainabilityPage() {
  return <Sustainability />;
}
