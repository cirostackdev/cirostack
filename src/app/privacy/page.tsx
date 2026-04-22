import type { Metadata } from "next";
import Privacy from "@/pages-src/Privacy";

export const metadata: Metadata = {
  title: "Privacy Policy | CiroStack",
  description: "CiroStack's privacy policy and data handling practices.",
};

export default function PrivacyPage() {
  return <Privacy />;
}
