import type { Metadata } from "next";
import { Bricolage_Grotesque, Sora } from "next/font/google";
import "@/styles/globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});
import { Suspense } from "react";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WhatsAppPopup } from "@/components/WhatsAppPopup";
import { FacebookPixel } from "@/components/FacebookPixel";

const SITE_URL = "https://cirostack.com";
const OG_IMAGE = `${SITE_URL}/images/pages/hero-bg.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CiroStack — Custom Software, Apps & AI for Growing Businesses",
    template: "%s | CiroStack",
  },
  description:
    "CiroStack builds custom websites, mobile apps, and AI automation solutions for growing businesses. Fixed-price engagements. Senior engineers. Delivery in weeks.",
  keywords: [
    "custom software development",
    "mobile app development",
    "AI automation",
    "web development agency",
    "software development agency Nigeria",
    "Next.js development",
    "React development",
    "CiroStack",
  ],
  authors: [{ name: "CiroStack", url: SITE_URL }],
  creator: "CiroStack",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    google: "fTAqT8iLRxD944c1bCW9uZjxKCV7jV4bwR754Praqz8",
  },
  openGraph: {
    type: "website",
    siteName: "CiroStack",
    locale: "en_US",
    url: SITE_URL,
    title: "CiroStack — Custom Software, Apps & AI for Growing Businesses",
    description:
      "CiroStack builds custom websites, mobile apps, and AI automation solutions for growing businesses. Fixed-price engagements. Senior engineers. Delivery in weeks.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "CiroStack — Software Development Agency" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@CiroStack",
    creator: "@CiroStack",
    title: "CiroStack — Custom Software, Apps & AI for Growing Businesses",
    description:
      "CiroStack builds custom websites, mobile apps, and AI automation solutions for growing businesses. Fixed-price. Senior engineers. Delivery in weeks.",
    images: [OG_IMAGE],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.png",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolageGrotesque.variable} ${sora.variable}`}
    >
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-PXTP0DF4VH" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-PXTP0DF4VH');`,
          }}
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <FacebookPixel />
        </Suspense>
        <Providers>
          <div className="min-h-screen flex flex-col bg-background">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm focus:font-medium"
            >
              Skip to content
            </a>
            <Navbar />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
            <WhatsAppPopup />
          </div>
        </Providers>
      </body>
    </html>
  );
}
