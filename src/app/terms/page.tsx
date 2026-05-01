import type { Metadata } from "next";
import Terms from "@/pages-src/Terms";

export const metadata: Metadata = {
  title: "Terms of Service | CiroStack",
  description: "CiroStack's terms of service.",
  alternates: { canonical: "https://cirostack.com/terms" },
  openGraph: {
    url: "https://cirostack.com/terms",
    title: "Terms of Service | CiroStack",
    description: "CiroStack's terms of service governing your use of our platform and services.",
    images: [{ url: "https://cirostack.com/images/pages/hero-generic.jpg", width: 1200, height: 630, alt: "Terms of Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | CiroStack",
    description: "CiroStack's terms of service governing your use of our platform and services.",
    images: ["https://cirostack.com/images/pages/hero-generic.jpg"],
  },
};

export default function TermsPage() {
  return <Terms />;
}
