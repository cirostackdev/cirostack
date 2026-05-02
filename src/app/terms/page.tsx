import type { Metadata } from "next";
import Terms from "@/pages-src/Terms";

export const metadata: Metadata = {
  title: "Terms of Service | CiroStack",
  description: "CiroStack's terms of service.",
  alternates: { canonical: "https://cirostack.com/terms" },
  openGraph: {
    url: "https://cirostack.com/terms",
    title: "Terms of Service — CiroStack",
    description: "The terms and conditions that govern your use of CiroStack's website and services. Clear language, no hidden clauses — read the fine print before we get started.",
    images: [{ url: "https://cirostack.com/og/pages/terms.jpg", width: 1200, height: 630, alt: "Terms of Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service — CiroStack",
    description: "The terms and conditions that govern your use of CiroStack's website and services. Clear language, no hidden clauses — read the fine print before we get started.",
    images: ["https://cirostack.com/og/pages/terms.jpg"],
  },
};

export default function TermsPage() {
  return <Terms />;
}
