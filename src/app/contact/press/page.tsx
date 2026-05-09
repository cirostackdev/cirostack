import type { Metadata } from "next";
import ContactPress from "@/pages-src/ContactPress";

export const metadata: Metadata = {
  title: "Press & Speaking",
  description: "Media inquiries, speaking engagements, workshops, panel discussions, and accelerator partnerships with CiroStack.",
  alternates: { canonical: "https://cirostack.com/contact/press" },
  openGraph: {
    url: "https://cirostack.com/contact/press",
    title: "Press & Speaking | CiroStack",
    description: "Invite CiroStack to speak, contribute expert commentary, run a workshop, or explore partnership opportunities.",
    images: [{ url: "https://cirostack.com/og/pages/contact.jpg", width: 1200, height: 630, alt: "Press and Speaking — CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/pages/contact.jpg"],
  },
};

export default function ContactPressPage() {
  return <ContactPress />;
}
