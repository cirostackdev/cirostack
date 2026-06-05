import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import NewsroomArticle from "@/pages-src/NewsroomArticle";

type Props = {
  searchParams: Promise<{ src?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { src } = await searchParams;

  if (!src) {
    return {
      title: "Article Not Found | CiroStack Newsroom",
      description: "This article could not be found.",
    };
  }

  const articleUrl = decodeURIComponent(src);

  try {
    const article = await prisma.newsArticle.findUnique({
      where: { url: articleUrl },
      select: { title: true, description: true, image: true, publishedAt: true },
    });

    if (!article) {
      return {
        title: "Article Not Found | CiroStack Newsroom",
        description: "This article could not be found.",
      };
    }

    const title = `${article.title} | CiroStack Newsroom`;
    const description = article.description || `Read this article on CiroStack Newsroom.`;
    const image = article.image || "https://cirostack.com/og/pages/newsroom.jpg";

    return {
      title,
      description,
      alternates: { canonical: `https://cirostack.com/newsroom/article/?src=${encodeURIComponent(articleUrl)}` },
      openGraph: {
        type: "article",
        url: `https://cirostack.com/newsroom/article/?src=${encodeURIComponent(articleUrl)}`,
        title: article.title,
        description,
        images: [{ url: image, width: 1200, height: 630, alt: article.title }],
        publishedTime: article.publishedAt.toISOString(),
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: "Industry News | CiroStack Newsroom",
      description: "Stay up to date with the latest news in startups, software development, AI, and the tech industry.",
    };
  }
}

export default function NewsroomArticlePage() {
  return (
    <Suspense>
      <NewsroomArticle />
    </Suspense>
  );
}
