"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import heroGeneric from "@/assets/hero-generic.jpg";

const ThankYou = () => (
  <Layout>
    <SEO title="Thank You" description="Thank you for contacting CiroStack. We will be in touch shortly." />
    <PageHero
      icon={CheckCircle}
      title="Thank You!"
      description="Your message has been received. We'll get back to you within 24 hours with a response or free quote."
      image={heroGeneric}
      ctaText="Back to Home"
      ctaLink="/"
    />
  </Layout>
);

export default ThankYou;
