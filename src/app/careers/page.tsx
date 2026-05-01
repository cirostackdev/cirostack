import type { Metadata } from "next";
import Careers from "@/pages-src/Careers";

export const metadata: Metadata = {
  title: "Careers | CiroStack",
  description: "Join the CiroStack team. Open roles for engineers, designers, and product leaders.",
  alternates: { canonical: "https://cirostack.com/careers" },
  openGraph: {
    url: "https://cirostack.com/careers",
    title: "Careers | CiroStack",
    description: "Join the CiroStack team. Open roles for engineers, designers, and product leaders.",
    images: [{ url: "https://cirostack.com/api/og?bg=/images/pages/hero-careers.jpg", width: 1200, height: 630, alt: "Careers at CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers | CiroStack",
    description: "Join the CiroStack team. Open roles for engineers, designers, and product leaders.",
    images: ["https://cirostack.com/api/og?bg=/images/pages/hero-careers.jpg"],
  },
};

export default function CareersPage() {
  return <Careers />;
}
