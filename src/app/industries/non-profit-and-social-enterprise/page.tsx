import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Non-Profit & Social Enterprise Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Non-Profit & Social Enterprise industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/non-profit-and-social-enterprise" },
  openGraph: {
    url: "https://cirostack.com/industries/non-profit-and-social-enterprise",
    title: "Non-Profit & Social Enterprise Software Solutions | CiroStack",
    description:
      "Custom software for the Non-Profit & Social Enterprise industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/api/og?title=Non-Profit%20%26%20Social%20Enterprise%20Software%20Solutions%20%7C%20CiroStack&description=Custom%20software%20for%20the%20Non-Profit%20%26%20Social%20Enterprise%20industry.%20Fixed-price.%20Senior%20engineers.%20Shipped%20in%20weeks.&label=Industries&bg=%2Fimages%2Fpages%2Fhero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Non Profit And Social Enterprise" }],
  },
};

export default function NonProfitAndSocialEnterprisePage() {
  return <IndustryCategory categoryId="non-profit-and-social-enterprise" />;
}
