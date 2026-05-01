import type { Metadata } from "next";
import Privacy from "@/pages-src/Privacy";

export const metadata: Metadata = {
  title: "Privacy Policy | CiroStack",
  description: "CiroStack's privacy policy and data handling practices.",
  alternates: { canonical: "https://cirostack.com/privacy" },
  openGraph: {
    url: "https://cirostack.com/privacy",
    title: "Privacy Policy | CiroStack",
    description: "CiroStack's privacy policy and data handling practices.",
    images: [{ url: "https://cirostack.com/api/og?bg=/images/pages/hero-generic.jpg", width: 1200, height: 630, alt: "Privacy Policy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | CiroStack",
    description: "CiroStack's privacy policy and data handling practices.",
    images: ["https://cirostack.com/api/og?bg=/images/pages/hero-generic.jpg"],
  },
};

export default function PrivacyPage() {
  return <Privacy />;
}
