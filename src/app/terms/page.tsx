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
    images: [{ url: `https://cirostack.com/api/og?title=${encodeURIComponent("Terms of Service | CiroStack")}&description=${encodeURIComponent("Terms governing your use of CiroStack's platform and services.")}`, width: 1200, height: 630, alt: "Terms of Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | CiroStack",
    description: "CiroStack's terms of service governing your use of our platform and services.",
    images: [`https://cirostack.com/api/og?title=${encodeURIComponent("Terms of Service | CiroStack")}&description=${encodeURIComponent("Terms governing your use of CiroStack's platform and services.")}`],
  },
};

export default function TermsPage() {
  return <Terms />;
}
