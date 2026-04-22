import type { Metadata } from "next";
import Blog from "@/pages-src/Blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical guides, case studies, and engineering insights from the CiroStack team — covering software architecture, AI, DevOps, and product development.",
  alternates: { canonical: "https://cirostack.com/blog" },
  openGraph: {
    images: [{ url: "https://cirostack.com/images/pages/hero-blog.jpg", width: 1200, height: 630, alt: "CiroStack" }],
    url: "https://cirostack.com/blog",
    title: "Blog | CiroStack",
    description:
      "Technical guides, case studies, and engineering insights — software architecture, AI, DevOps, and product development.",
  },
};

export default function BlogPage() {
  return <Blog />;
}
