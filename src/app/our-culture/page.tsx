import type { Metadata } from "next";
import OurCulture from "@/pages-src/OurCulture";

export const metadata: Metadata = {
  title: "Our Culture | CiroStack",
  description: "The values, rituals, and principles that make CiroStack a great place to build.",
  alternates: { canonical: "https://cirostack.com/our-culture" },
  openGraph: {
    url: "https://cirostack.com/our-culture",
    title: "Our Culture | CiroStack",
    description: "The values, rituals, and principles that make CiroStack a great place to build software.",
    images: [{ url: `https://cirostack.com/api/og?title=${encodeURIComponent("Our Culture | CiroStack")}&description=${encodeURIComponent("The values, rituals, and principles that make CiroStack a great place to build software.")}&label=${encodeURIComponent("Culture")}`, width: 1200, height: 630, alt: "CiroStack Culture" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Culture | CiroStack",
    description: "The values, rituals, and principles that make CiroStack a great place to build software.",
    images: [`https://cirostack.com/api/og?title=${encodeURIComponent("Our Culture | CiroStack")}&description=${encodeURIComponent("The values, rituals, and principles that make CiroStack a great place to build software.")}&label=${encodeURIComponent("Culture")}`],
  },
};

export default function OurCulturePage() {
  return <OurCulture />;
}
