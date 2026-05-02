import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "libraries";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/libraries` },
  openGraph: {
    url: `https://cirostack.com/industries/libraries`,
    title: "Custom Software for Libraries — CiroStack",
    description: "We build catalog search tools, event registration platforms, and digital lending interfaces that help libraries serve patrons better and demonstrate their value to the community.",
    images: [{ url: "https://cirostack.com/og/industry-pages/libraries.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/libraries.jpg"],
  },
};

export default function LibrariesPage() {
  return <Industry />;
}
