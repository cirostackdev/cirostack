"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Shield, CheckCircle2, Zap } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { industriesData } from "@/data/industries-generated";
import { industriesData as parentData } from "@/data/industries";
import { projects, projectImages } from "@/data/caseStudies";
import imgDefault from "@/assets/hero-industry.jpg";
import CountUp from "@/components/industries/CountUp";
import CategoryFAQ from "@/components/industries/CategoryFAQ";

interface Props {
  categoryId: string;
}

/** Generic compliance pills — overridden per parent category */
const complianceMap: Record<string, string[]> = {
  "Healthcare & Medical": ["HIPAA", "HITECH", "FHIR / HL7", "GDPR", "WCAG 2.1 AA"],
  "Financial Services": ["PCI-DSS L1", "SOC 2 Type II", "ISO 27001", "PSD2", "GDPR"],
  "Retail & E-Commerce": ["PCI-DSS", "GDPR", "CCPA", "WCAG 2.1 AA"],
  "Education & E-Learning": ["FERPA", "COPPA", "WCAG 2.1 AA", "GDPR"],
  "Government & Public Sector": ["FedRAMP", "FISMA", "Section 508", "WCAG 2.1 AA"],
  "Legal Services": ["GDPR", "SOC 2", "Attorney-Client Privilege", "eDiscovery"],
};

const defaultCompliance = ["GDPR", "SOC 2", "ISO 27001", "WCAG 2.1 AA"];

/** Generic FAQs per category — overridden per parent category title */
function buildFaqs(parentTitle: string) {
  return [
    {
      question: `What kind of ${parentTitle.toLowerCase()} businesses do you typically work with?`,
      answer: `We partner with companies of all sizes in the ${parentTitle.toLowerCase()} space — from venture-backed startups building their first product, to mid-market firms modernizing legacy systems, to established enterprises rolling out AI and automation. The common thread: teams that want senior engineers, fixed pricing, and software that ships fast.`,
    },
    {
      question: `How do you handle compliance and regulatory requirements?`,
      answer: `Compliance is architected into the project from day one — not bolted on at launch. We map every requirement (whether it's HIPAA, PCI-DSS, GDPR, FERPA, or industry-specific frameworks) to concrete engineering controls, document them for your auditors, and verify them in CI. We've passed dozens of third-party audits.`,
    },
    {
      question: `What's the typical timeline for a ${parentTitle.toLowerCase()} project?`,
      answer: `Most fixed-price MVPs ship in 4–8 weeks. Larger platforms or heavily-regulated builds (healthcare, finance, government) typically run 10–16 weeks including compliance review and penetration testing. We agree on scope and timeline upfront — if we go over, that's on us.`,
    },
    {
      question: `Do we own the code and IP after launch?`,
      answer: `Yes — completely. From day one, all source code, designs, and IP belong to you. No license fees, no vendor lock-in, no required ongoing retainer. We can hand off to your in-house team, stay on for support, or both.`,
    },
  ];
}

/** Find best-matching case study for this parent category */
function findRelatedCaseStudy(parentTitle: string) {
  const entries = Object.entries(projects);
  // Try exact match
  let match = entries.find(
    ([, p]) => p.industry.toLowerCase() === parentTitle.toLowerCase()
  );
  // Try partial match
  if (!match) {
    const firstWord = parentTitle.split(/\s|&/)[0].toLowerCase();
    match = entries.find(([, p]) =>
      p.industry.toLowerCase().includes(firstWord)
    );
  }
  return match
    ? { id: match[0], project: match[1], image: projectImages[match[0]] }
    : null;
}

export default function IndustryCategory({ categoryId }: Props) {
  const parent = parentData[categoryId];
  if (!parent) return null;

  const Icon = parent.icon;

  const subIndustries = Object.values(industriesData).filter(
    (ind) => ind.parentCategory === parent.title
  );

  const compliance = complianceMap[parent.title] ?? defaultCompliance;
  const faqs = buildFaqs(parent.title);
  const related = findRelatedCaseStudy(parent.title);

  return (
    <Layout>
      <SEO
        title={`${parent.title} Software Solutions`}
        description={parent.tagline}
        url={`/industries/${categoryId}`}
      />

      {/* ══════════════════════════════════════════════
          EDITORIAL HERO
          ══════════════════════════════════════════════ */}
      <section className="relative pt-28 md:pt-36 pb-20 md:pb-28 overflow-hidden">
        {/* Background image with strong overlay */}
        <div className="absolute inset-0 -z-10">
          <img
            src={imgDefault}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-xs text-muted-foreground mb-6 flex items-center gap-2"
          >
            <Link href="/industries" className="hover:text-primary transition-colors">
              Industries
            </Link>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground">{parent.title}</span>
          </motion.nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16 items-end">
            {/* Left — title block */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-3 mb-6"
              >
                <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center">
                  <Icon className="w-6 h-6 text-foreground" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Industry Solutions
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-foreground leading-[0.95] tracking-tight mb-6"
              >
                <span className="text-gradient italic">{parent.title}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8"
              >
                {parent.tagline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <Link href="/contact">
                  <Button size="lg" className="rounded-full text-base px-8 group">
                    Start Your Project
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right — vertical stat stack */}
            {parent.stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border"
              >
                {parent.stats.slice(0, 4).map((s) => (
                  <div
                    key={s.label}
                    className="bg-card p-5 md:p-6"
                  >
                    <p className="text-3xl md:text-4xl font-display font-bold text-gradient mb-1 tabular-nums leading-none">
                      {s.value}
                    </p>
                    <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          INTRO — pull-quote + body
          ══════════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:sticky lg:top-28"
            >
              <p className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-[1.1] tracking-tight">
                <span className="text-muted-foreground/50">"</span>
                {parent.introSummary}
                <span className="text-muted-foreground/50">"</span>
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {parent.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CHALLENGES — editorial numbered list
          ══════════════════════════════════════════════ */}
      {parent.challenges.length > 0 && (
        <section className="section-padding section-alt">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <SectionHeading
              badge="Industry Challenges"
              title={`What ${parent.title.toLowerCase()} businesses face.`}
            />
            <div className="space-y-0">
              {parent.challenges.map((challenge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="grid grid-cols-[auto_1fr] gap-6 md:gap-10 py-7 md:py-9 border-t border-border last:border-b group"
                >
                  <span className="text-5xl md:text-7xl font-display font-bold text-muted-foreground/30 group-hover:text-foreground transition-colors tabular-nums leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-lg md:text-xl text-foreground leading-relaxed font-display">
                    {challenge}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          SOLUTIONS — alternating rows
          ══════════════════════════════════════════════ */}
      {parent.solutions.length > 0 && (
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <SectionHeading
              badge="Our Solutions"
              title="How we solve it."
            />
            <div className="space-y-12 md:space-y-20">
              {parent.solutions.map((sol, i) => {
                const isRight = i % 2 === 1;
                return (
                  <motion.div
                    key={sol.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${
                      isRight ? "md:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    {/* Visual block */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border">
                      <div className="absolute inset-0 bg-gradient-to-br from-muted via-secondary to-background" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-9xl md:text-[10rem] font-display font-bold text-foreground/10 opacity-90 tabular-nums leading-none">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="absolute top-5 left-5">
                        <Icon className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="absolute bottom-5 right-5">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          Solution
                        </span>
                      </div>
                    </div>
                    {/* Text */}
                    <div>
                      <span className="text-xs font-mono text-muted-foreground tabular-nums mb-3 block">
                        Solution {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-4 leading-tight">
                        {sol.title}
                      </h3>
                      <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        {sol.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          COMPLIANCE STRIP
          ══════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 section-alt border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-[hsl(var(--trust)/0.1)] flex items-center justify-center">
                <Shield className="w-6 h-6 text-[hsl(var(--trust))]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  Compliance & Standards
                </p>
                <p className="font-display font-semibold text-foreground">
                  Built to your industry's bar.
                </p>
              </div>
            </div>
            <div className="flex-1 flex flex-wrap gap-2 md:justify-end">
              {compliance.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-card border border-border text-foreground"
                >
                  <CheckCircle2 className="w-3 h-3 text-[hsl(var(--trust))]" />
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SUB-INDUSTRIES — directory list
          ══════════════════════════════════════════════ */}
      {subIndustries.length > 0 && (
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeading
              badge={`${parent.title} Sectors`}
              title="Explore specialized solutions"
              description={`We build tailored software for every corner of the ${parent.title.toLowerCase()} industry.`}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0 max-w-6xl mx-auto">
              {subIndustries.map((sub) => {
                const SubIcon = sub.icon;
                return (
                  <Link
                    key={sub.id}
                    href={`/industries/${sub.id}`}
                    className="group flex items-center gap-4 py-5 border-b border-border hover:border-foreground/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-foreground transition-colors">
                      <SubIcon className="w-5 h-5 text-muted-foreground group-hover:text-background transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display font-semibold text-foreground text-base group-hover:text-foreground transition-colors">
                        {sub.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {sub.tagline}
                      </p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          RELATED CASE STUDY
          ══════════════════════════════════════════════ */}
      {related && (
        <section className="section-padding section-alt">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <SectionHeading
              badge="Featured Case Study"
              title="See it in production."
            />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href={`/portfolio/${related.id}`}
                className="group grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-border bg-card hover-lift"
              >
                <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                  <img
                    src={related.image}
                    alt={related.project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-5 left-5">
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-white/15 text-white backdrop-blur-md border border-white/20">
                      Case Study
                    </span>
                  </div>
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    {related.project.industry} · {related.project.client}
                  </p>
                  <h3 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-4 leading-tight">
                    {related.project.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                    {related.project.description}
                  </p>
                  {related.project.metrics?.[0] && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--trust)/0.1)] text-[hsl(var(--trust))] text-sm font-semibold mb-6 self-start">
                      <Zap className="w-4 h-4" />
                      {related.project.metrics[0].value} {related.project.metrics[0].label}
                    </div>
                  )}
                  <span className="text-foreground text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read the case study <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          FAQ
          ══════════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6">
          <CategoryFAQ items={faqs} title={`${parent.title} questions, answered.`} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FINAL CTA
          ══════════════════════════════════════════════ */}
      <section className="relative section-padding section-alt overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full bg-gradient-to-br from-primary/10 via-accent/5 to-transparent blur-3xl" />
        </div>
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
              Ready to transform
              <br />
              your{" "}
              <span className="text-gradient italic">
                {parent.title.toLowerCase()}
              </span>{" "}
              business?
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed max-w-xl mx-auto">
              Tell us about your project. We respond within 24 hours with a free, no-obligation quote.
            </p>
            <Link href="/contact">
              <Button size="lg" className="rounded-full text-base px-8 group">
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
