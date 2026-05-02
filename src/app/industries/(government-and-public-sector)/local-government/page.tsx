import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "local-government";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/local-government` },
  openGraph: {
    url: `https://cirostack.com/industries/local-government`,
    title: "Custom Software for Local Government | CiroStack",
    description: "From permit applications to public records portals and council meeting tools, we build software that helps local governments run more transparently and respond to residents faster.",
    images: [{ url: "https://cirostack.com/og/industry-pages/local-government.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/local-government.jpg"],
  },
};

export default function LocalGovernmentPage() {
  return <Industry />;
}
