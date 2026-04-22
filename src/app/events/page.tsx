import type { Metadata } from "next";
import Events from "@/pages-src/Events";

export const metadata: Metadata = {
  title: "Events | CiroStack",
  description: "CiroStack events, workshops, and meetups.",
};

export default function EventsPage() {
  return <Events />;
}
