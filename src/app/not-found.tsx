import type { Metadata } from "next";
import NotFound from "@/pages-src/NotFound";

export const metadata: Metadata = {
  title: "Page Not Found | CiroStack",
  description: "The page you're looking for doesn't exist or has been moved.",
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return <NotFound />;
}
