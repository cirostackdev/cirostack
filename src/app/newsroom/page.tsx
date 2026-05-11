import type { Metadata } from "next";
import Newsroom from "@/pages-src/Newsroom";

export const metadata: Metadata = {
  title: "Newsroom | CiroStack",
  description: "CiroStack press releases, announcements, and media coverage.",
  alternates: { canonical: "https://cirostack.com/newsroom/" },
  openGraph: {
    url: "https://cirostack.com/newsroom/",
    title: "Newsroom | What's Happening at CiroStack",
    description: "Press releases, company announcements, and media coverage. Stay up to date on what CiroStack is building, launching, and shipping for businesses around the world.",
    images: [{ url: "https://cirostack.com/og/pages/newsroom.jpg", width: 1200, height: 630, alt: "CiroStack Newsroom" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Newsroom | What's Happening at CiroStack",
    description: "Press releases, company announcements, and media coverage. Stay up to date on what CiroStack is building, launching, and shipping for businesses around the world.",
    images: ["https://cirostack.com/og/pages/newsroom.jpg"],
  },
};

export default function NewsroomPage() {
  return <Newsroom />;
}
