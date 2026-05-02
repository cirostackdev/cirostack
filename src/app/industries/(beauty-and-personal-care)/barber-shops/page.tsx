import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "barber-shops";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/barber-shops` },
  openGraph: {
    url: `https://cirostack.com/industries/barber-shops`,
    title: "Custom Software for Barber Shops — CiroStack",
    description: "We build chair scheduling apps, walk-in queue managers, and loyalty reward systems that help barber shops cut wait times and keep regulars coming back every few weeks.",
    images: [{ url: "https://cirostack.com/og/industry-pages/barber-shops.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/barber-shops.jpg"],
  },
};

export default function BarberShopsPage() {
  return <Industry />;
}
