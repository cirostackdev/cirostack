import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "salons";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/salons` },
  openGraph: {
    url: `https://cirostack.com/industries/salons`,
    title: "Custom Software for Salons — CiroStack",
    description: "We build stylist booking platforms, product retail integrations, and client history dashboards that give salons everything they need to manage chairs, inventory, and repeat visits.",
    images: [{ url: "https://cirostack.com/og/industry-pages/salons.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/salons.jpg"],
  },
};

export default function SalonsPage() {
  return <Industry />;
}
