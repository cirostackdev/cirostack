import type { Metadata } from "next";
import EventRegister from "@/pages-src/EventRegister";

export const metadata: Metadata = {
  title: "Event Registration | CiroStack",
  description: "Register for a CiroStack event, webinar, or workshop.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <EventRegister />;
}
