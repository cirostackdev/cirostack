import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "news-and-media";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/news-and-media` },
  openGraph: {
    url: `https://cirostack.com/industries/news-and-media`,
    title: "Custom Software for News & Media — CiroStack",
    description: "Our team delivers custom CMS platforms, editorial workflow tools, and audience analytics dashboards for news organizations that move fast and publish often.",
    images: [{ url: "https://cirostack.com/og/industry-pages/news-and-media.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/news-and-media.jpg"],
  },
};

export default function NewsAndMediaPage() {
  return <Industry />;
}
