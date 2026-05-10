import type { Metadata } from "next";
import NewsroomArticle from "@/pages-src/NewsroomArticle";

export const metadata: Metadata = {
  title: "Industry News | CiroStack Newsroom",
  description: "Stay up to date with the latest news in startups, software development, AI, and the tech industry.",
};

export default function NewsroomArticlePage() {
  return <NewsroomArticle />;
}
