import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Beauty & Personal Care Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Beauty & Personal Care industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/beauty-and-personal-care" },
  openGraph: {
    url: "https://cirostack.com/industries/beauty-and-personal-care",
    title: "Software for Beauty & Personal Care | CiroStack",
    description:
      "Booking systems, client management, and marketing tools for salons, spas, barber shops, and beauty brands. We build software that keeps your chairs full and your clients coming back.",
    images: [{ url: "https://cirostack.com/og/industries/beauty-and-personal-care.jpg", width: 1200, height: 630, alt: "CiroStack Beauty And Personal Care" }],
  },
};

export default function BeautyAndPersonalCarePage() {
  return <IndustryCategory categoryId="beauty-and-personal-care" />;
}
