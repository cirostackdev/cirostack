import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "security-audit";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/security-audit.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "Security Audit & Penetration Testing — CiroStack",
    description: "We find the vulnerabilities before attackers do. Manual penetration testing, code-level security review, and compliance mapping for HIPAA, SOC 2, GDPR, and more.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Security Audit & Penetration Testing — CiroStack",
    description: "We find the vulnerabilities before attackers do. Manual penetration testing, code-level security review, and compliance mapping for HIPAA, SOC 2, GDPR, and more.",
    images: [ogImageUrl],
  },
};

export default function SecurityAuditPage() {
  return <ServiceDetail />;
}
