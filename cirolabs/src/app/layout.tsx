import type { Metadata } from "next";
import { Bricolage_Grotesque, Sora } from "next/font/google";
import "./globals.css";
import CiroLabsNav from "@/components/CiroLabsNav";
import CiroLabsFooter from "@/components/CiroLabsFooter";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

export const metadata: Metadata = {
  title: { default: "CiroLabs — Learn to Build with AI", template: "%s | CiroLabs" },
  description: "The mobile learning app by CiroStack. Real dev skills, AI-powered workflows, a direct path into the industry.",
  metadataBase: new URL("https://cirolabs.cirostack.com"),
  openGraph: { siteName: "CiroLabs", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${sora.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <CiroLabsNav />
        <main className="flex-1">{children}</main>
        <CiroLabsFooter />
      </body>
    </html>
  );
}
