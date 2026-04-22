import type { Metadata } from "next";
import Sustainability from "@/pages-src/Sustainability";

export const metadata: Metadata = {
  title: "Sustainability | CiroStack",
  description: "CiroStack's commitment to sustainable software development and responsible tech.",
};

export default function SustainabilityPage() {
  return <Sustainability />;
}
