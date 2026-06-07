import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import NewsroomArticle from "@/pages-src/NewsroomArticle";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = await prisma.newsArticle.findUnique({
      where: { slug },
      select: { title: true, description: true, image: true, publishedAt: true, slug: true, source: true },
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

    const ogImage = `https://cirostack.com/api/og/news/${article.slug}`;

    return {
      title,
      description,
      alternates: { canonical: `https://cirostack.com/newsroom/${article.slug}` },
      openGraph: {
        type: "article",
        url: `https://cirostack.com/newsroom/${article.slug}`,
        title: article.title,
        description,
        images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
        publishedTime: article.publishedAt.toISOString(),
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return {
      title: "Industry News | CiroStack Newsroom",
      description: "Stay up to date with the latest news in startups, software development, AI, and the tech industry.",
    };
  }
}

export default async function NewsroomSlugPage({ params }: Props) {
  const { slug } = await params;

  // Fetch article for JSON-LD
  let jsonLd = null;
  try {
    const article = await prisma.newsArticle.findUnique({
      where: { slug },
      select: { title: true, description: true, image: true, publishedAt: true, updatedAt: true, slug: true, source: true, url: true },
    });
    if (article) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.title,
        description: article.description || undefined,
        image: article.image || undefined,
        datePublished: article.publishedAt.toISOString(),
        dateModified: article.updatedAt.toISOString(),
        url: `https://cirostack.com/newsroom/${article.slug}`,
        mainEntityOfPage: `https://cirostack.com/newsroom/${article.slug}`,
        publisher: {
          "@type": "Organization",
          name: "CiroStack",
          url: "https://cirostack.com",
          logo: { "@type": "ImageObject", url: "https://cirostack.com/logo.png" },
        },
        author: { "@type": "Organization", name: article.source },
        isAccessibleForFree: true,
      };
    }
  } catch {}

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Suspense>
        <NewsroomArticle slug={slug} />
      </Suspense>
    </>
  );
}
