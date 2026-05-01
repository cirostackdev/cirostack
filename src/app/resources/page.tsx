import type { Metadata } from "next";
import Resources from "@/pages-src/Resources";

export const metadata: Metadata = {
  title: "Resources | CiroStack",
  description: "Guides, templates, and tools for software teams and founders.",
  alternates: { canonical: "https://cirostack.com/resources" },
  openGraph: {
    url: "https://cirostack.com/resources",
    title: "Resources | CiroStack",
    description: "Guides, templates, and tools for software teams and founders.",
    images: [{ url: `https://cirostack.com/api/og?title=${encodeURIComponent("Resources | CiroStack")}&description=${encodeURIComponent("Guides, templates, and tools for software teams and founders.")}&label=${encodeURIComponent("Resources")}`, width: 1200, height: 630, alt: "CiroStack Resources" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resources | CiroStack",
    description: "Guides, templates, and tools for software teams and founders.",
    images: [`https://cirostack.com/api/og?title=${encodeURIComponent("Resources | CiroStack")}&description=${encodeURIComponent("Guides, templates, and tools for software teams and founders.")}&label=${encodeURIComponent("Resources")}`],
  },
};

export default function ResourcesPage() {
  return <Resources />;
}
