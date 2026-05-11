import type { Metadata } from "next";
import ResourcesEstimate from "@/pages-src/ResourcesEstimate";

export const metadata: Metadata = {
  title: "Project Estimate Calculator | CiroStack",
  description: "Get a rough estimate for your software project in 60 seconds. Based on project type, features, and timeline.",
  alternates: { canonical: "https://cirostack.com/resources/estimate/" },
  openGraph: {
    url: "https://cirostack.com/resources/estimate/",
    title: "Project Estimate Calculator | CiroStack",
    description: "Get a rough estimate for your software project in 60 seconds. Based on project type, features, and timeline.",
    images: [{ url: "https://cirostack.com/og/pages/resources.jpg", width: 1200, height: 630, alt: "Project Estimate Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Estimate Calculator | CiroStack",
    description: "Get a rough estimate for your software project in 60 seconds. Based on project type, features, and timeline.",
    images: ["https://cirostack.com/og/pages/resources.jpg"],
  },
};

export default function EstimatePage() {
  return <ResourcesEstimate />;
}
