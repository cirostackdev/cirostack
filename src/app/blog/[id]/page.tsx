import type { Metadata } from "next";
import BlogPostPage from "@/pages-src/BlogPost";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return posts.map((p) => ({ id: p.slug }));
  } catch {
    // Fallback to empty — Next.js will generate on-demand
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug: id, published: true },
      select: { title: true, excerpt: true, imageUrl: true, date: true },
    });
    if (!post) return { title: "Blog | CiroStack" };

    const ogImage = `https://www.cirostack.com/api/og/blog/${id}/`;

    return {
      title: `${post.title} | CiroStack Blog`,
      description: post.excerpt,
      alternates: { canonical: `https://www.cirostack.com/blog/${id}/` },
      openGraph: {
        type: "article",
        url: `https://www.cirostack.com/blog/${id}/`,
        title: post.title,
        description: post.excerpt,
        images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
        siteName: "CiroStack",
      },
      twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [ogImage] },
    };
  } catch {
    return { title: "Blog | CiroStack" };
  }
}

export default async function BlogPostRoute({ params }: Props) {
  const { id } = await params;

  let jsonLd = null;
  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug: id, published: true },
      select: { title: true, excerpt: true, imageUrl: true, date: true, author: true, slug: true },
    });
    if (post) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: `https://www.cirostack.com/api/og/blog/${post.slug}/`,
        datePublished: post.date,
        url: `https://www.cirostack.com/blog/${post.slug}/`,
        mainEntityOfPage: `https://www.cirostack.com/blog/${post.slug}/`,
        publisher: {
          "@type": "Organization",
          name: "CiroStack",
          url: "https://www.cirostack.com",
          logo: { "@type": "ImageObject", url: "https://www.cirostack.com/logo.png" },
        },
        author: { "@type": "Person", name: post.author },
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
      <BlogPostPage />
    </>
  );
}
