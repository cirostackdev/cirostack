import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "iam";
const service = servicesData[slug];

const ogImageUrl = "https://cirostack.com/og/services/iam.jpg";

export const metadata: Metadata = {
  title: service ? `${service.title} | CiroStack` : "Service | CiroStack",
  description: service?.tagline ?? service?.description ?? "",
  alternates: { canonical: `https://cirostack.com/services/${slug}` },
  openGraph: {
    url: `https://cirostack.com/services/${slug}`,
    title: "Identity & Access Management — CiroStack",
    description: "Secure, seamless identity for every user. We implement SSO, MFA, role-based access, and automated provisioning so your team and customers can log in safely and painlessly.",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: service?.title ?? "CiroStack Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Identity & Access Management — CiroStack",
    description: "Secure, seamless identity for every user. We implement SSO, MFA, role-based access, and automated provisioning so your team and customers can log in safely and painlessly.",
    images: [ogImageUrl],
  },
};

export default function IamPage() {
  return <ServiceDetail />;
}
