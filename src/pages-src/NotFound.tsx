"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import heroGeneric from "@/assets/hero-generic.jpg";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <Layout>
      <SEO title="Page Not Found" description="The page you are looking for does not exist on CiroStack." />
      <PageHero
        icon={AlertTriangle}
        title="Page Not Found"
        description="Oops! The page you're looking for doesn't exist. Let's get you back on track."
        image={heroGeneric}
        ctaText="Back to Home"
        ctaLink="/"
      />
    </Layout>
  );
};

export default NotFound;
