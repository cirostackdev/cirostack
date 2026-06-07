import type { Metadata } from "next";
import { Suspense } from "react";
import { permanentRedirect } from "next/navigation";
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
      select: { title: true, description: true, image: true, publishedAt: true, slug: true },
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
      alternates: { canonical: `https://cirostack.com/newsroom/${article.slug}` },
      openGraph: {
        type: "article",
        url: `https://cirostack.com/newsroom/${article.slug}`,
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

export default async function NewsroomArticlePage({ searchParams }: Props) {
  const { src } = await searchParams;

  // If we have a src param, try to redirect to the slug-based URL
  if (src) {
    const articleUrl = decodeURIComponent(src);
    try {
      const article = await prisma.newsArticle.findUnique({
        where: { url: articleUrl },
        select: { slug: true },
      });

      if (article?.slug) {
        permanentRedirect(`/newsroom/${article.slug}`);
      }
    } catch {
      // Fall through to legacy rendering if redirect fails
    }
  }

  // Fallback: render the legacy component (in case article isn't found by URL)
  return (
    <Suspense>
      <NewsroomArticle />
    </Suspense>
  );
}
