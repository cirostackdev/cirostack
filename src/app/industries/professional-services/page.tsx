import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Professional Services Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Professional Services industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/professional-services" },
  openGraph: {
    url: "https://cirostack.com/industries/professional-services",
    title: "Professional Services Software Solutions | CiroStack",
    description:
      "Custom software for the Professional Services industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/api/og?title=Professional%20Services%20Software%20Solutions%20%7C%20CiroStack&description=Custom%20software%20for%20the%20Professional%20Services%20industry.%20Fixed-price.%20Senior%20engineers.%20Shipped%20in%20weeks.&label=Industries&bg=%2Fimages%2Fpages%2Fhero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Professional Services" }],
  },
};

export default function ProfessionalServicesPage() {
  return <IndustryCategory categoryId="professional-services" />;
}
