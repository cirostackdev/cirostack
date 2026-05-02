import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "contractors";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/contractors` },
  openGraph: {
    url: `https://cirostack.com/industries/contractors`,
    title: "Custom Software for Contractors — CiroStack",
    description: "We build estimate generators, project scheduling tools, and client communication portals that help contractors win more bids and finish jobs on time without the back-and-forth.",
    images: [{ url: "https://cirostack.com/og/industry-pages/contractors.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/contractors.jpg"],
  },
};

export default function ContractorsPage() {
  return <Industry />;
}
