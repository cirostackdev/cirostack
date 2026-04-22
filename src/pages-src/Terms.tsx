"use client";

import { FileText } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import heroGeneric from "@/assets/hero-generic.jpg";

const Terms = () => (
  <Layout>
    <SEO
      title="Terms of Service"
      description="The terms and conditions that govern the use of CiroStack's website and software development services."
      url="/terms"
    />
    <PageHero
      icon={FileText}
      title="Terms of Service"
      description="The terms and conditions that govern the use of our services."
      image={heroGeneric}
      ctaText="Contact Us"
      ctaLink="/contact"
    />
    <section className="section-padding">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>Last updated: February 27, 2026</p>
          <h2 className="text-xl font-display font-semibold text-foreground">1. Services</h2>
          <p>CiroStack provides software development services including website design, web and mobile application development, and AI automation solutions as described in individual project agreements.</p>
          <h2 className="text-xl font-display font-semibold text-foreground">2. Project Agreements</h2>
          <p>Each project is governed by a separate agreement that outlines scope, deliverables, timeline, and pricing. All projects are fixed-price unless otherwise specified.</p>
          <h2 className="text-xl font-display font-semibold text-foreground">3. Intellectual Property</h2>
          <p>Upon full payment, clients receive full ownership of all custom code and designs created for their project. We retain the right to showcase work in our portfolio unless otherwise agreed.</p>
          <h2 className="text-xl font-display font-semibold text-foreground">4. Contact</h2>
          <p>For questions about these terms, please contact us at <a href="mailto:hello@cirostack.com" className="text-primary hover:underline">hello@cirostack.com</a>.</p>
        </div>
      </div>
    </section>
  </Layout>
);

export default Terms;
