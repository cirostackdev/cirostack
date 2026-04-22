import type { Metadata } from "next";
import Newsletter from "@/pages-src/Newsletter";

export const metadata: Metadata = {
  title: "Newsletter | CiroStack",
  description: "Subscribe to the CiroStack newsletter for software insights and updates.",
};

export default function NewsletterPage() {
  return <Newsletter />;
}
