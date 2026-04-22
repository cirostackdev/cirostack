import type { Metadata } from "next";
import ThankYou from "@/pages-src/ThankYou";

export const metadata: Metadata = {
  title: "Thank You | CiroStack",
  description: "Thank you for getting in touch with CiroStack.",
};

export default function ThankYouPage() {
  return <ThankYou />;
}
