import type { Metadata } from "next";
import Events from "@/pages-src/Events";

export const metadata: Metadata = {
  title: "Events | CiroStack",
  description: "CiroStack events, workshops, and meetups.",
  alternates: { canonical: "https://cirostack.com/events" },
  openGraph: {
    url: "https://cirostack.com/events",
    title: "Events & Workshops — CiroStack",
    description: "Join our workshops, meetups, and live sessions for founders and software teams. Learn how we build, ship, and scale products — straight from the engineers who do it.",
    images: [{ url: "https://cirostack.com/og/pages/events.jpg", width: 1200, height: 630, alt: "CiroStack Events" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Events & Workshops — CiroStack",
    description: "Join our workshops, meetups, and live sessions for founders and software teams. Learn how we build, ship, and scale products — straight from the engineers who do it.",
    images: ["https://cirostack.com/og/pages/events.jpg"],
  },
};

export default function EventsPage() {
  return <Events />;
}
