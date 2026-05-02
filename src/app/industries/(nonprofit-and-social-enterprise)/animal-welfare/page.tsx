import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "animal-welfare";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/animal-welfare` },
  openGraph: {
    url: `https://cirostack.com/industries/animal-welfare`,
    title: "Custom Software for Animal Welfare | CiroStack",
    description: "CiroStack builds adoption management platforms, donor portals, and animal intake tracking systems that help shelters and rescue organizations save more lives with less overhead.",
    images: [{ url: "https://cirostack.com/og/industry-pages/animal-welfare.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/animal-welfare.jpg"],
  },
};

export default function AnimalWelfarePage() {
  return <Industry />;
}
