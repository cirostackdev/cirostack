import type { Metadata } from "next";
import { Suspense } from "react";
import NewsroomArticle from "@/pages-src/NewsroomArticle";

export const metadata: Metadata = {
  title: "Industry News | CiroStack Newsroom",
  description: "Stay up to date with the latest news in startups, software development, AI, and the tech industry.",
  alternates: { canonical: "https://cirostack.com/newsroom/article/" },
  openGraph: {
    url: "https://cirostack.com/newsroom/article/",
    title: "Industry News | CiroStack Newsroom",
    description: "Stay up to date with the latest news in startups, software development, AI, and the tech industry.",
    images: [{ url: "https://cirostack.com/og/pages/newsroom.jpg", width: 1200, height: 630, alt: "CiroStack Newsroom" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Industry News | CiroStack Newsroom",
    description: "Stay up to date with the latest news in startups, software development, AI, and the tech industry.",
    images: ["https://cirostack.com/og/pages/newsroom.jpg"],
  },
};

export default function NewsroomArticlePage() {
  return (
    <Suspense>
      <NewsroomArticle />
    </Suspense>
  );
}
