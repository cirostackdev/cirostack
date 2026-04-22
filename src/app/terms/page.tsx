import type { Metadata } from "next";
import Terms from "@/pages-src/Terms";

export const metadata: Metadata = {
  title: "Terms of Service | CiroStack",
  description: "CiroStack's terms of service.",
};

export default function TermsPage() {
  return <Terms />;
}
