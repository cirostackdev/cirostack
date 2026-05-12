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
      select: { title: true, excerpt: true, imageUrl: true },
    });
    if (!post) return { title: "Blog | CiroStack" };
    return {
      title: post.title,
      description: post.excerpt,
      alternates: { canonical: `https://cirostack.com/blog/${id}/` },
      openGraph: {
        type: "article",
        url: `https://cirostack.com/blog/${id}/`,
        title: post.title,
        description: post.excerpt,
        images: post.imageUrl ? [{ url: post.imageUrl, width: 1200, height: 630 }] : [],
        siteName: "CiroStack",
      },
      twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
    };
  } catch {
    return { title: "Blog | CiroStack" };
  }
}

export default async function BlogPostRoute({ params }: Props) {
  void params;
  return <BlogPostPage />;
}
