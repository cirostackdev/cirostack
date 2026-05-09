"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, CheckCircle2, Zap } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { startupsData } from "@/data/startups-generated";
import { startupsParentData } from "@/data/startups";
import { projects, projectImages } from "@/data/caseStudies";
import CategoryFAQ from "@/components/industries/CategoryFAQ";
import CategoryPicker from "@/components/industries/CategoryPicker";

interface Props {
  categoryId: string;
}

function buildFaqs(parentTitle: string) {
  return [
    {
      question: `What types of startups do you work with in the "${parentTitle}" category?`,
      answer: `We work with startups at every stage and size. Whether you are a solo founder with an idea or a funded team scaling to millions of users, we tailor our approach to your specific situation. The common thread: founders who want senior engineers, fixed pricing, and software that ships fast.`,
    },
    {
      question: `How does your fixed-price model work?`,
      answer: `We scope your project in a paid discovery sprint, then deliver a fixed quote before writing production code. If we go over budget, that is on us. No hourly billing, no surprise invoices. You know exactly what you are paying before development starts.`,
    },
    {
      question: `What is the typical timeline for a startup project?`,
      answer: `Most MVPs ship in 4-8 weeks. Larger platforms or heavily-regulated builds typically run 10-16 weeks including compliance review. We agree on scope and timeline upfront and track against it weekly.`,
    },
    {
      question: `Do we own the code and IP?`,
      answer: `Yes, completely. From day one, all source code, designs, and IP belong to you. No license fees, no vendor lock-in, no required ongoing retainer. We can hand off to your in-house team or stay on for support.`,
    },
  ];
}

function findRelatedCaseStudy(parentTitle: string) {
  const entries = Object.entries(projects);
  const keywords: Record<string, string[]> = {
    "By Stage": ["startup", "mvp", "launch"],
    "By Vertical": ["fintech", "health", "education", "retail"],
    "By Product Type": ["platform", "app", "saas", "marketplace"],
    "By Founder Type": ["founder", "startup", "build"],
    "By Challenge": ["rescue", "scale", "rebuild"],
    "By Engagement": ["team", "build", "develop"],
  };
  const searchTerms = keywords[parentTitle] || ["startup"];
  let match = entries.find(([, p]) =>
    searchTerms.some(term =>
      p.description.toLowerCase().includes(term) ||
      p.vertical.toLowerCase().includes(term)
    )
  );
  if (!match) match = entries[0];
  return match
    ? { id: match[0], project: match[1], image: projectImages[match[0]] }
    : null;
}

export default function StartupCategory({ categoryId }: Props) {
  const parent = startupsParentData[categoryId];
  if (!parent) return null;

  const Icon = parent.icon;

  const subStartups = Object.values(startupsData).filter(
    (s) => s.parentCategory === parent.title
  );

  const faqs = buildFaqs(parent.title);
  const related = findRelatedCaseStudy(parent.title);

  return (
    <Layout>
      <SEO
        title={`${parent.title} - Startup Software Solutions`}
        description={parent.tagline}
        url={`/startups/${categoryId}`}
      />

      {/* Hero */}
      <PageHero
        icon={Icon}
        title={parent.title}
        description={parent.tagline}
        image={`/images/startups/hero-cat-${categoryId}.jpg`}
        ctaText="Start Your Project"
        ctaLink="/contact"
      />

      {/* Sub-startups: hover picker */}
      {subStartups.length > 0 && (
        <section className="section-padding section-alt">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground leading-tight max-w-2xl">
                Hover. Explore. <span className="text-gradient">Find your fit.</span>
              </h2>
            </div>
            <CategoryPicker
              categories={subStartups.map((sub) => ({
                id: sub.id,
                title: sub.title,
                tagline: sub.tagline,
                icon: sub.icon,
                image: `/images/startups/hero-${sub.id}.jpg`,
              }))}
              basePath="/startups"
            />
          </div>
        </section>
      )}

      {/* Intro */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-32"
            >
              <blockquote className="text-2xl md:text-3xl font-display font-bold text-foreground leading-snug italic">
                "Senior engineers, fixed pricing, shipped in weeks."
              </blockquote>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="prose prose-lg max-w-none text-muted-foreground"
            >
              <p>{parent.description}</p>
              <p>
                We have shipped over 50 startup products across every stage, vertical, and engagement model.
                Our engineers bring pattern recognition from dozens of similar builds, so you skip the expensive
                mistakes and move straight to traction.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why CiroStack */}
      <section className="section-padding section-alt">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <SectionHeading
            badge="Why CiroStack"
            title="Built for startup realities."
            description="Limited runway, fast pivots, ambitious timelines. We get it."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: Zap, title: "Ship in Weeks", desc: "Most projects launch in 4-8 weeks. We scope ruthlessly and execute without bloat." },
              { icon: Shield, title: "Fixed Price", desc: "The quote is the price. No hourly billing, no scope creep, no surprises at invoice time." },
              { icon: CheckCircle2, title: "Senior Only", desc: "Every engineer on your project has 5+ years of experience. No juniors, no handoffs." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Case Study */}
      {related && (
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <SectionHeading badge="Case Study" title="See it in action." />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-card border border-border rounded-3xl overflow-hidden"
            >
              <div className="aspect-[4/3] lg:aspect-auto">
                <img
                  src={related.image}
                  alt={related.project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
                  {related.project.vertical}
                </p>
                <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                  {related.project.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {related.project.description}
                </p>
                <Link href={`/portfolio/${related.id}`}>
                  <Button variant="outline" className="rounded-full">
                    Read Case Study <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <CategoryFAQ items={faqs} />

      {/* Final CTA */}
      <section className="section-padding section-alt">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
              Ready to build?
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
              Tell us about your startup. We respond within 24 hours with a free, no-obligation quote.
            </p>
            <Link href="/start">
              <Button size="lg" className="rounded-full px-10 group">
                Get a Free Quote
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
