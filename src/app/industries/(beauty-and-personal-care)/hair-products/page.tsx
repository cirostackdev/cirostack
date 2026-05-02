import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "hair-products";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/hair-products` },
  openGraph: {
    url: `https://cirostack.com/industries/hair-products`,
    title: "Custom Software for Hair Products — CiroStack",
    description: "We build e-commerce storefronts, wholesale distributor portals, and ingredient transparency pages that help hair product brands grow online and in salons — delivered at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/hair-products.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/hair-products.jpg"],
  },
};

export default function HairProductsPage() {
  return <Industry />;
}
