import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "event-venues";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/event-venues` },
  openGraph: {
    url: `https://cirostack.com/industries/event-venues`,
    title: "Custom Software for Event Venues — CiroStack",
    description: "We build venue availability calendars, event configuration tools, and client proposal generators that help event venues book more dates and manage setup details without the back-and-forth.",
    images: [{ url: "https://cirostack.com/og/industry-pages/event-venues.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/event-venues.jpg"],
  },
};

export default function EventVenuesPage() {
  return <Industry />;
}
