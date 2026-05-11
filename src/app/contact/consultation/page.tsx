import type { Metadata } from "next";
import ContactConsultation from "@/pages-src/ContactConsultation";

export const metadata: Metadata = {
  title: "Book a Free Consultation",
  description: "Book a free 30-minute call with a senior CiroStack engineer. No sales pitch — just an honest conversation about your idea and whether we're the right fit.",
  alternates: { canonical: "https://cirostack.com/contact/consultation/" },
  openGraph: {
    url: "https://cirostack.com/contact/consultation/",
    title: "Book a Free Consultation | CiroStack",
    description: "30 minutes with a senior engineer. No sales pitch, no obligation. Walk away with clarity on your project.",
    images: [{ url: "https://cirostack.com/og/pages/contact.jpg", width: 1200, height: 630, alt: "Book a Consultation with CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Free Consultation | CiroStack",
    description: "30 minutes with a senior engineer. No sales pitch, no obligation. Walk away with clarity on your project.",
    images: ["https://cirostack.com/og/pages/contact.jpg"],
  },
};

export default function ConsultationPage() {
  return <ContactConsultation />;
}
