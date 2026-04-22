"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import heroIndustry from "@/assets/hero-industry.jpg";
import { industriesData } from "@/data/industries";
import { Button } from "@/components/ui/button";

const entries = Object.values(industriesData);

/** Map industry data key → first sub-industry route slug.
 *  Route groups use slightly different slugs (e.g. "elearning" vs "e-learning"),
 *  so we link to the parent category page on the services-style path. */
const industryHref = (id: string) => {
  // The route groups drop some hyphens — but individual sub-industry pages
  // are nested inside them. The simplest reliable link is to the first
  // sub-industry, but we don't import that map here. Instead, link to
  // a well-known sub-industry or use the id directly since the homepage
  // already links this way.
  return `/industries/${id}`;
};

const Industries = () => {
  return (
    <Layout>
      <SEO
        title="Industries We Serve"
        description="CiroStack builds custom software, apps, and AI solutions for 20+ industries — from healthcare and finance to retail, logistics, and beyond."
        url="/industries"
      />

      <PageHero
        badge="Industries"
        title="Software built for"
        highlight="your industry."
        description="We don't just write code — we learn your regulations, your users, your market dynamics. Then we build software that fits."
        image={heroIndustry}
        ctaText="Start Your Project"
        ctaLink="/contact"
      />

      {/* ── All 20 industries ── */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            badge="20+ Verticals"
            title="Deep expertise across every sector."
            description="Each industry has unique challenges — compliance requirements, user expectations, market dynamics. We bring domain knowledge to every engagement."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {entries.map((ind) => {
              const Icon = ind.icon;
              return (
                <Link key={ind.id} href={industryHref(ind.id)} className="block group">
                  <div className="h-full p-5 md:p-6 rounded-xl surface-glass hover-lift">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground text-sm md:text-base mb-1.5">
                      {ind.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-3">
                      {ind.tagline}
                    </p>
                    <span className="text-primary text-xs font-medium inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      Explore <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="py-14 section-alt">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: "20+", label: "Industry Verticals" },
              { value: "200+", label: "Sub-Industry Pages" },
              { value: "50+", label: "Projects Delivered" },
              { value: "5", label: "Countries Served" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-display font-bold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How we approach industry work ── */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading
              badge="Our Approach"
              title="Domain knowledge meets engineering excellence."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                {
                  title: "We learn your domain",
                  body: "Before writing a line of code, we study your industry's compliance landscape, user expectations, and competitive dynamics.",
                },
                {
                  title: "We build to your standards",
                  body: "HIPAA for healthcare. PCI-DSS for finance. GDPR for EU markets. Compliance is architected in — not bolted on.",
                },
                {
                  title: "We measure what matters",
                  body: "Every project tracks industry-specific KPIs — patient outcomes, cart conversion, fleet utilization — not just vanity metrics.",
                },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-xl border border-border bg-card">
                  <h4 className="font-display font-semibold text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-padding section-alt">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Don't see your industry? <span className="text-gradient">We still build for you.</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
              Our engineering team adapts to any domain. Tell us about your business and we'll show you how we can help.
            </p>
            <Link href="/contact">
              <Button size="lg" className="rounded-full text-base px-8 group">
                Get a Free Quote
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Industries;
