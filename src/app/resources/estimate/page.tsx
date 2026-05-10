import type { Metadata } from "next";
import ResourcesEstimate from "@/pages-src/ResourcesEstimate";

export const metadata: Metadata = {
  title: "Project Estimate Calculator | CiroStack",
  description: "Get a rough estimate for your software project in 60 seconds. Based on project type, features, and timeline.",
  alternates: { canonical: "https://cirostack.com/resources/estimate" },
};

export default function EstimatePage() {
  return <ResourcesEstimate />;
}
