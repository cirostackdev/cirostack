import type { Metadata } from "next";
import { Suspense } from "react";
import CareersApply from "@/pages-src/CareersApply";

export const metadata: Metadata = {
  title: "Apply — Careers",
  description: "Submit your application to join CiroStack. We review every application personally and respond to every candidate within 5 business days.",
  alternates: { canonical: "https://cirostack.com/careers/apply" },
  openGraph: {
    url: "https://cirostack.com/careers/apply",
    title: "Apply to CiroStack",
    description: "Join a remote-first team of senior engineers, designers, and builders. Submit your application — we review every one personally.",
    images: [{ url: "https://cirostack.com/og/pages/careers.jpg", width: 1200, height: 630, alt: "Apply to CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/pages/careers.jpg"],
  },
};

export default function CareersApplyPage() {
  return (
    <Suspense fallback={null}>
      <CareersApply />
    </Suspense>
  );
}
