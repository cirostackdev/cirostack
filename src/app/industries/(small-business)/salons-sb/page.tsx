import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "salons-sb";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/salons-sb` },
  openGraph: {
    url: `https://cirostack.com/industries/salons-sb`,
    title: "Custom Software for Salons — CiroStack",
    description: "Our team builds appointment booking apps, client history trackers, and staff scheduling tools for salons ready to ditch the paper calendar and run a tighter operation.",
    images: [{ url: "https://cirostack.com/og/industry-pages/salons-sb.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/salons-sb.jpg"],
  },
};

export default function SalonsSbPage() {
  return <Industry />;
}
