import type { Metadata } from "next";
import Blog from "@/pages-src/Blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical guides, case studies, and engineering insights from the CiroStack team: covering software architecture, AI, DevOps, and product development.",
  alternates: { canonical: "https://cirostack.com/blog/" },
  openGraph: {
    images: [{ url: "https://cirostack.com/og/pages/blog.jpg", width: 1200, height: 630, alt: "CiroStack Blog" }],
    url: "https://cirostack.com/blog/",
    title: "Blog | CiroStack",
    description:
      "Technical guides, case studies, and engineering insights: software architecture, AI, DevOps, and product development.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | CiroStack",
    description: "Technical guides, case studies, and engineering insights: software architecture, AI, DevOps, and product development.",
    images: ["https://cirostack.com/og/pages/blog.jpg"],
  },
};

async function getPosts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/cms/posts`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function BlogPage() {
  const serverPosts = await getPosts();
  return <Blog serverPosts={serverPosts} />;
}
