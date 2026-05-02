import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Media & Entertainment Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Media & Entertainment industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/media-and-entertainment" },
  openGraph: {
    url: "https://cirostack.com/industries/media-and-entertainment",
    title: "Software for Media & Entertainment — CiroStack",
    description:
      "Content platforms, streaming tools, and audience management systems for publishers, studios, and creators. We build media software that helps you create, distribute, and monetize your content.",
    images: [{ url: "https://cirostack.com/og/industries/media-and-entertainment.jpg", width: 1200, height: 630, alt: "CiroStack Media And Entertainment" }],
  },
};

export default function MediaAndEntertainmentPage() {
  return <IndustryCategory categoryId="media-and-entertainment" />;
}
