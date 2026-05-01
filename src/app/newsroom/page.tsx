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
    images: [{ url: `https://cirostack.com/api/og?title=${encodeURIComponent(&bg=%2Fimages%2Fpages%2Fhero-newsroom.jpg"Newsroom | CiroStack")}&description=${encodeURIComponent("CiroStack press releases, announcements, and media coverage.")}&label=${encodeURIComponent("Newsroom")}`, width: 1200, height: 630, alt: "CiroStack Newsroom" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Newsroom | CiroStack",
    description: "CiroStack press releases, announcements, and media coverage.",
    images: [`https://cirostack.com/api/og?title=${encodeURIComponent(&bg=%2Fimages%2Fpages%2Fhero-newsroom.jpg"Newsroom | CiroStack")}&description=${encodeURIComponent("CiroStack press releases, announcements, and media coverage.")}&label=${encodeURIComponent("Newsroom")}`],
  },
};

export default function NewsroomPage() {
  return <Newsroom />;
}
