import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "grocery-and-food-delivery";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/grocery-and-food-delivery` },
  openGraph: {
    url: `https://cirostack.com/industries/grocery-and-food-delivery`,
    title: "Custom Software for Grocery & Food Delivery — CiroStack",
    description: "Our team builds order management systems, delivery route optimizers, and real-time inventory sync tools for grocery and food delivery operations that move thousands of SKUs daily.",
    images: [{ url: "https://cirostack.com/og/industry-pages/grocery-and-food-delivery.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/grocery-and-food-delivery.jpg"],
  },
};

export default function GroceryAndFoodDeliveryPage() {
  return <Industry />;
}
