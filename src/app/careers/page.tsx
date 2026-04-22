import type { Metadata } from "next";
import Careers from "@/pages-src/Careers";

export const metadata: Metadata = {
  title: "Careers | CiroStack",
  description: "Join the CiroStack team. Open roles for engineers, designers, and product leaders.",
};

export default function CareersPage() {
  return <Careers />;
}
