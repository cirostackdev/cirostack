import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Beauty & Personal Care Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Beauty & Personal Care industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/beauty-and-personal-care" },
  openGraph: {
    url: "https://cirostack.com/industries/beauty-and-personal-care",
    title: "Beauty & Personal Care Software Solutions | CiroStack",
    description:
      "Custom software for the Beauty & Personal Care industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/api/og?title=Beauty%20%26%20Personal%20Care%20Software%20Solutions%20%7C%20CiroStack&description=Custom%20software%20for%20the%20Beauty%20%26%20Personal%20Care%20industry.%20Fixed-price.%20Senior%20engineers.%20Shipped%20in%20weeks.&label=Industries&bg=%2Fimages%2Fpages%2Fhero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Beauty And Personal Care" }],
  },
};

export default function BeautyAndPersonalCarePage() {
  return <IndustryCategory categoryId="beauty-and-personal-care" />;
}
