import type { Metadata } from "next";
import Newsroom from "@/pages-src/Newsroom";

export const metadata: Metadata = {
  title: "Newsroom | CiroStack",
  description: "CiroStack press releases, announcements, and media coverage.",
  alternates: { canonical: "https://cirostack.com/newsroom" },
  openGraph: {
    url: "https://cirostack.com/newsroom",
    title: "Newsroom | CiroStack",
    description: "CiroStack press releases, announcements, and media coverage.",
    images: [{ url: "https://cirostack.com/api/og?bg=/images/pages/hero-newsroom.jpg", width: 1200, height: 630, alt: "CiroStack Newsroom" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Newsroom | CiroStack",
    description: "CiroStack press releases, announcements, and media coverage.",
    images: ["https://cirostack.com/api/og?bg=/images/pages/hero-newsroom.jpg"],
  },
};

export default function NewsroomPage() {
  return <Newsroom />;
}
