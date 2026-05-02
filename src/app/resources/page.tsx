import type { Metadata } from "next";
import Resources from "@/pages-src/Resources";

export const metadata: Metadata = {
  title: "Resources | CiroStack",
  description: "Guides, templates, and tools for software teams and founders.",
  alternates: { canonical: "https://cirostack.com/resources" },
  openGraph: {
    url: "https://cirostack.com/resources",
    title: "Free Resources for Founders & Dev Teams — CiroStack",
    description: "Guides, templates, checklists, and tools we actually use to build and ship software. Free resources for founders, CTOs, and engineering teams planning their next project.",
    images: [{ url: "https://cirostack.com/og/pages/resources.jpg", width: 1200, height: 630, alt: "CiroStack Resources" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Resources for Founders & Dev Teams — CiroStack",
    description: "Guides, templates, checklists, and tools we actually use to build and ship software. Free resources for founders, CTOs, and engineering teams planning their next project.",
    images: ["https://cirostack.com/og/pages/resources.jpg"],
  },
};

export default function ResourcesPage() {
  return <Resources />;
}
