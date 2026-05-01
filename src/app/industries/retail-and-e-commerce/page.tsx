import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Retail & E-Commerce Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Retail & E-Commerce industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/retail-and-e-commerce" },
  openGraph: {
    url: "https://cirostack.com/industries/retail-and-e-commerce",
    title: "Retail & E-Commerce Software Solutions | CiroStack",
    description:
      "Custom software for the Retail & E-Commerce industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/api/og?title=Retail%20%26%20E-Commerce%20Software%20Solutions%20%7C%20CiroStack&description=Custom%20software%20for%20the%20Retail%20%26%20E-Commerce%20industry.%20Fixed-price.%20Senior%20engineers.%20Shipped%20in%20weeks.&label=Industries&bg=%2Fimages%2Fpages%2Fhero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Retail And E Commerce" }],
  },
};

export default function RetailAndECommercePage() {
  return <IndustryCategory categoryId="retail-and-e-commerce" />;
}
