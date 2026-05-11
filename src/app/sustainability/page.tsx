import type { Metadata } from "next";
import Sustainability from "@/pages-src/Sustainability";

export const metadata: Metadata = {
  title: "Sustainability | CiroStack",
  description: "CiroStack's commitment to sustainable software development and responsible tech.",
  alternates: { canonical: "https://cirostack.com/sustainability/" },
  openGraph: {
    url: "https://cirostack.com/sustainability/",
    title: "Sustainability | Building Responsibly at CiroStack",
    description: "How we build software responsibly, from energy-efficient infrastructure choices to thoughtful engineering practices. Our commitment to sustainable tech that serves people and the planet.",
    images: [{ url: "https://cirostack.com/og/pages/sustainability.jpg", width: 1200, height: 630, alt: "CiroStack Sustainability" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sustainability | Building Responsibly at CiroStack",
    description: "How we build software responsibly, from energy-efficient infrastructure choices to thoughtful engineering practices. Our commitment to sustainable tech that serves people and the planet.",
    images: ["https://cirostack.com/og/pages/sustainability.jpg"],
  },
};

export default function SustainabilityPage() {
  return <Sustainability />;
}
