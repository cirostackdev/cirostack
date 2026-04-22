"use client";

import { Shield } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import heroGeneric from "@/assets/hero-generic.jpg";

const Privacy = () => (
  <Layout>
    <SEO
      title="Privacy Policy"
      description="Learn how CiroStack collects, uses, and protects your personal information and data."
      url="/privacy"
    />
    <PageHero
      icon={Shield}
      title="Privacy Policy"
      description="How we collect, use, and protect your personal information."
      image={heroGeneric}
      ctaText="Contact Us"
      ctaLink="/contact"
    />
    <section className="section-padding">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>Last updated: February 27, 2026</p>
          <h2 className="text-xl font-display font-semibold text-foreground">1. Information We Collect</h2>
          <p>We collect information you provide directly when you contact us, submit a form, or use our services. This may include your name, email address, company name, and project details.</p>
          <h2 className="text-xl font-display font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>We use your information to respond to inquiries, provide our services, improve our website, and communicate project updates. We do not sell your personal data.</p>
          <h2 className="text-xl font-display font-semibold text-foreground">3. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, or destruction.</p>
          <h2 className="text-xl font-display font-semibold text-foreground">4. Contact</h2>
          <p>For questions about this policy, please contact us at <a href="mailto:hello@cirostack.com" className="text-primary hover:underline">hello@cirostack.com</a>.</p>
        </div>
      </div>
    </section>
  </Layout>
);

export default Privacy;
