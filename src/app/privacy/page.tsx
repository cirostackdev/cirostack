import type { Metadata } from "next";
import Privacy from "@/pages-src/Privacy";

export const metadata: Metadata = {
  title: "Privacy Policy | CiroStack",
  description: "CiroStack's privacy policy and data handling practices.",
  alternates: { canonical: "https://cirostack.com/privacy" },
  openGraph: {
    url: "https://cirostack.com/privacy",
    title: "Privacy Policy — CiroStack",
    description: "How we collect, store, and protect your data. We take privacy seriously — here's exactly what happens with your information when you use our site and services.",
    images: [{ url: "https://cirostack.com/og/pages/privacy.jpg", width: 1200, height: 630, alt: "Privacy Policy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — CiroStack",
    description: "How we collect, store, and protect your data. We take privacy seriously — here's exactly what happens with your information when you use our site and services.",
    images: ["https://cirostack.com/og/pages/privacy.jpg"],
  },
};

export default function PrivacyPage() {
  return <Privacy />;
}
