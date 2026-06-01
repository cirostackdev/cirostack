import type { Metadata } from "next";
import WorkPolicy from "@/pages-src/WorkPolicy";

export const metadata: Metadata = {
  title: "Work Policy | CiroStack",
  description: "How we work at CiroStack. Our standards for communication, code quality, security, and professional conduct. Remote-first, ownership-driven, built on trust.",
  alternates: { canonical: "https://cirostack.com/work-policy/" },
  openGraph: {
    url: "https://cirostack.com/work-policy/",
    title: "Work Policy | How We Operate at CiroStack",
    description: "Remote-first, ownership-driven, built on trust. Our standards for communication, delivery, security, and professional conduct.",
    images: [{ url: "https://cirostack.com/og/pages/work-policy.jpg", width: 1200, height: 630, alt: "CiroStack Work Policy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Work Policy | How We Operate at CiroStack",
    description: "Remote-first, ownership-driven, built on trust. Our standards for communication, delivery, security, and professional conduct.",
    images: ["https://cirostack.com/og/pages/work-policy.jpg"],
  },
};

export default function WorkPolicyPage() {
  return <WorkPolicy />;
}
