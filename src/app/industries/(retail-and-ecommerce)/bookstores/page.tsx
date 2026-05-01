import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "bookstores";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/bookstores` },
  openGraph: {
    url: `https://cirostack.com/industries/bookstores`,
    title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
    description: industry?.tagline ?? "",
    images: [{ url: "https://cirostack.com/images/industries/hero-bookstores.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/images/industries/hero-bookstores.jpg"],
  },
};

export default function BookstoresPage() {
  return <Industry />;
}
