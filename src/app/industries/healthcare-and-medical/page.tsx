import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Healthcare & Medical Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Healthcare & Medical industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/healthcare-and-medical" },
  openGraph: {
    url: "https://cirostack.com/industries/healthcare-and-medical",
    title: "Software for Healthcare & Medical — CiroStack",
    description:
      "HIPAA-compliant platforms for hospitals, clinics, telehealth providers, and medical practices. We build patient management, scheduling, and analytics tools that let you focus on care, not paperwork.",
    images: [{ url: "https://cirostack.com/og/industries/healthcare-and-medical.jpg", width: 1200, height: 630, alt: "CiroStack Healthcare And Medical" }],
  },
};

export default function HealthcareAndMedicalPage() {
  return <IndustryCategory categoryId="healthcare-and-medical" />;
}
