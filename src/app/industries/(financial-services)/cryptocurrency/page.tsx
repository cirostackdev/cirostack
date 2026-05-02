import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "cryptocurrency";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/cryptocurrency` },
  openGraph: {
    url: `https://cirostack.com/industries/cryptocurrency`,
    title: "Custom Software for Cryptocurrency — CiroStack",
    description: "We build portfolio tracking dashboards, transaction monitoring tools, and wallet integration platforms that help cryptocurrency businesses operate transparently and stay compliant.",
    images: [{ url: "https://cirostack.com/og/industry-pages/cryptocurrency.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/cryptocurrency.jpg"],
  },
};

export default function CryptocurrencyPage() {
  return <Industry />;
}
