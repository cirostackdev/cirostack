"use client";

import { usePathname } from "next/navigation";
import { Clock } from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import heroGeneric from "@/assets/hero-generic.jpg";

const BlankPage = () => {
  const pathname = usePathname();
  const title = pathname
    .split("/")
    .pop()
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()) || "Page";

  return (
    <Layout>
      <PageHero
        icon={Clock}
        title={title}
        description="This page is coming soon. We're working hard to bring you great content here."
        image={heroGeneric}
        ctaText="Back to Home"
        ctaLink="/"
      />
    </Layout>
  );
};

export default BlankPage;
