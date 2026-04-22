import type { Metadata } from "next";
import Resources from "@/pages-src/Resources";

export const metadata: Metadata = {
  title: "Resources | CiroStack",
  description: "Guides, templates, and tools for software teams and founders.",
};

export default function ResourcesPage() {
  return <Resources />;
}
