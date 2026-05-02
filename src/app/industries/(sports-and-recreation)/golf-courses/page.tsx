import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "golf-courses";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/golf-courses` },
  openGraph: {
    url: `https://cirostack.com/industries/golf-courses`,
    title: "Custom Software for Golf Courses — CiroStack",
    description: "We build tee time booking systems, tournament management tools, and member portals for golf courses that want a smooth experience from reservation to the 18th hole.",
    images: [{ url: "https://cirostack.com/og/industry-pages/golf-courses.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/golf-courses.jpg"],
  },
};

export default function GolfCoursesPage() {
  return <Industry />;
}
