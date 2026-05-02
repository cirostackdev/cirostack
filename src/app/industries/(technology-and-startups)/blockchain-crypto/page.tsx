import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "blockchain-crypto";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/blockchain-crypto` },
  openGraph: {
    url: `https://cirostack.com/industries/blockchain-crypto`,
    title: "Custom Software for Blockchain & Crypto | CiroStack",
    description: "Our senior engineers build wallet integrations, transaction explorers, and token management dashboards for blockchain and crypto projects that need reliable, auditable code.",
    images: [{ url: "https://cirostack.com/og/industry-pages/blockchain-crypto.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/blockchain-crypto.jpg"],
  },
};

export default function BlockchainCryptoPage() {
  return <Industry />;
}
