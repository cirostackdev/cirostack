import type { Metadata } from "next";
import OurCulture from "@/pages-src/OurCulture";

export const metadata: Metadata = {
  title: "Our Culture | CiroStack",
  description: "The values, rituals, and principles that make CiroStack a great place to build.",
};

export default function OurCulturePage() {
  return <OurCulture />;
}
