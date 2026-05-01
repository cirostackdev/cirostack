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
    images: [{ url: `https://cirostack.com/api/og?title=${encodeURIComponent("Sustainability | CiroStack")}&description=${encodeURIComponent("Our commitment to sustainable software development and responsible tech.")}&label=${encodeURIComponent("Sustainability")}`, width: 1200, height: 630, alt: "CiroStack Sustainability" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sustainability | CiroStack",
    description: "CiroStack's commitment to sustainable software development and responsible tech.",
    images: [`https://cirostack.com/api/og?title=${encodeURIComponent("Sustainability | CiroStack")}&description=${encodeURIComponent("Our commitment to sustainable software development and responsible tech.")}&label=${encodeURIComponent("Sustainability")}`],
  },
};

export default function SustainabilityPage() {
  return <Sustainability />;
}
