import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "online-courses";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/online-courses` },
  openGraph: {
    url: `https://cirostack.com/industries/online-courses`,
    title: "Custom Software for Online Courses | CiroStack",
    description: "Our senior engineers build course delivery platforms, video hosting integrations, and student engagement analytics that help online course creators teach effectively and grow their audience.",
    images: [{ url: "https://cirostack.com/og/industry-pages/online-courses.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/online-courses.jpg"],
  },
};

export default function OnlineCoursesPage() {
  return <Industry />;
}
