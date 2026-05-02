import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "iot-companies";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/iot-companies` },
  openGraph: {
    url: `https://cirostack.com/industries/iot-companies`,
    title: "Custom Software for IoT Companies | CiroStack",
    description: "We build device management platforms, sensor data dashboards, and firmware update systems for IoT companies connecting hardware to software at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industry-pages/iot-companies.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/iot-companies.jpg"],
  },
};

export default function IotCompaniesPage() {
  return <Industry />;
}
