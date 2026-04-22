import type { Metadata } from "next";
import Newsroom from "@/pages-src/Newsroom";

export const metadata: Metadata = {
  title: "Newsroom | CiroStack",
  description: "CiroStack press releases, announcements, and media coverage.",
};

export default function NewsroomPage() {
  return <Newsroom />;
}
