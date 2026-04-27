"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { industriesData } from "@/data/industries";
import CategoryPicker from "@/components/industries/CategoryPicker";
import CountUp from "@/components/industries/CountUp";
import CategoryFAQ from "@/components/industries/CategoryFAQ";

import imgHealthflow from "@/assets/portfolio-healthflow.jpg";
import imgShoplocal from "@/assets/portfolio-shoplocal.jpg";
import imgAutotask from "@/assets/portfolio-autotask.jpg";
import imgFinguard from "@/assets/portfolio-finguard.jpg";
import imgEduspark from "@/assets/portfolio-eduspark.jpg";
import imgFactoryiq from "@/assets/portfolio-factoryiq.jpg";
import imgPropview from "@/assets/portfolio-propview.jpg";
import imgLogistrack from "@/assets/portfolio-logistrack.jpg";
import imgTravelease from "@/assets/portfolio-travelease.jpg";
import imgLegalshield from "@/assets/portfolio-legalshield.jpg";
import imgGovportal from "@/assets/portfolio-govportal.jpg";
import imgSportspulse from "@/assets/portfolio-sportspulse.jpg";
import imgBeautybook from "@/assets/portfolio-beautybook.jpg";
import imgAutodrive from "@/assets/portfolio-autodrive.jpg";
import imgSmallbizos from "@/assets/portfolio-smallbizos.jpg";
import imgGivehub from "@/assets/portfolio-givehub.jpg";
import imgLaunchpad from "@/assets/portfolio-launchpad.jpg";
import imgAgriconnect from "@/assets/portfolio-agriconnect.jpg";
import imgBuildsite from "@/assets/portfolio-buildsite.jpg";
import imgStreamdeck from "@/assets/portfolio-streamdeck.jpg";

const imgHero = "/images/industries/hero-cat-all-industries.jpg";

const entries = Object.values(industriesData);

/** Image map per industry id, with fallback */
const imageMap: Record<string, string> = {
  "healthcare-and-medical": imgHealthflow,
  "retail-and-e-commerce": imgShoplocal,
  "financial-services": imgFinguard,
  "education-and-e-learning": imgEduspark,
  "manufacturing-and-industrial": imgFactoryiq,
  "real-estate-and-property": imgPropview,
  "transportation-and-logistics": imgLogistrack,
  "hospitality-and-tourism": imgTravelease,
  "legal-services": imgLegalshield,
  "government-and-public-sector": imgGovportal,
  "sports-and-recreation": imgSportspulse,
  "beauty-and-personal-care": imgBeautybook,
  "automotive": imgAutodrive,
  "small-business": imgSmallbizos,
  "non-profit-and-social-enterprise": imgGivehub,
  "technology-and-startups": imgLaunchpad,
  "agriculture-and-farming": imgAgriconnect,
  "construction-and-engineering": imgBuildsite,
  "media-and-entertainment": imgStreamdeck,
  "professional-services": imgAutotask,
};

const pickerCategories = entries.map((ind) => ({
  id: ind.id,
  title: ind.title,
  tagline: ind.tagline,
  icon: ind.icon,
  image: imageMap[ind.id] ?? imgHealthflow,
}));

const faqs = [
  {
    question: "How do you handle industry-specific compliance like HIPAA, PCI-DSS, or GDPR?",
    answer:
      "Compliance is architected into the project from day one — never bolted on. We map each requirement to concrete engineering controls (encryption at rest/in transit, audit logging, RBAC, data residency), document them for your auditors, and test them in CI. We've shipped to HIPAA, PCI-DSS Level 1, SOC 2, GDPR, and WCAG 2.1 AA.",
  },
  {
    question: "Do you have reusable IP per industry, or is everything built from scratch?",
    answer:
      "Both. We have hardened modules (auth, billing, multi-tenant data isolation, EHR integration, payment processing, geospatial fleet tracking) we can drop in to save weeks. Anything custom we write is yours from day one — code, designs, and IP. No lock-in.",
  },
  {
    question: "What if my industry isn't in your top 20 verticals?",
    answer:
      "We've shipped software in 35+ verticals. The 20 listed are where we have the deepest playbooks. For anything outside, we run a discovery sprint to map your domain — regulations, user mental models, KPIs — before scoping. Most industries take 1–2 weeks to ramp on.",
  },
  {
    question: "How long does an industry-specific MVP usually take?",
    answer:
      "Most fixed-price industry MVPs ship in 4–8 weeks. Heavily-regulated verticals (healthcare, finance, gov) add 2–4 weeks for compliance review and penetration testing. We agree on scope and timeline upfront — if we go over, that's on us.",
  },
  {
    question: "Can you integrate with our existing industry tools?",
    answer:
      "Yes. We routinely integrate with EHR systems (Epic, Cerner, FHIR), payment gateways (Stripe, Adyen), POS (Square, Clover, Shopify), CRMs (Salesforce, HubSpot), ERPs (SAP, NetSuite), and industry-specific APIs (MLS, HL7, EDI, ISO 20022). If it has an API, we can talk to it.",
  },
];

const Industries = () => {
  return (
    <Layout>
      <SEO
        title="Industries We Serve"
        description="CiroStack builds custom software, apps, and AI solutions for 20+ industries — from healthcare and finance to retail, logistics, and beyond."
        url="/industries"
      />

      {/* ══════════════════════════════════════════════
          MOSAIC HERO
          ══════════════════════════════════════════════ */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <img
            src={imgHero}
            alt=""
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-background/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
        </div>

        {/* Animated icon mosaic backdrop */}
        <div className="absolute inset-0 -z-10 opacity-[0.07] dark:opacity-[0.12]">
          <div className="grid grid-cols-6 md:grid-cols-8 gap-4 p-6 h-full">
            {entries.concat(entries).slice(0, 48).map((ind, i) => {
              const Icon = ind.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 4 + (i % 3),
                    repeat: Infinity,
                    delay: (i * 0.15) % 3,
                  }}
                  className="aspect-square flex items-center justify-center"
                >
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-foreground" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/85 to-background" />

        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-foreground leading-[0.95] tracking-tight mb-6 max-w-5xl mx-auto"
          >
            Software built for
            <br />
            <span className="text-gradient italic">your industry.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-base md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            We don't just write code — we learn your regulations, your users, your market dynamics. Then we build software that fits.
          </motion.p>

          {/* Inline counter */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap items-baseline justify-center gap-x-6 gap-y-2 text-sm md:text-base text-muted-foreground mb-10"
          >
            <span><span className="text-2xl md:text-3xl font-display font-bold text-foreground tabular-nums">20+</span> verticals</span>
            <span className="text-muted-foreground/40">·</span>
            <span><span className="text-2xl md:text-3xl font-display font-bold text-foreground tabular-nums">200+</span> specialties</span>
            <span className="text-muted-foreground/40">·</span>
            <span><span className="text-2xl md:text-3xl font-display font-bold text-foreground tabular-nums">5</span> countries</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/contact">
              <Button size="lg" className="rounded-full text-base px-8 group">
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PICK YOUR SECTOR — alphabetical with preview
          ══════════════════════════════════════════════ */}
      <section className="section-padding section-alt">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground leading-tight max-w-2xl">
              Hover. Explore. <span className="text-gradient">Find your fit.</span>
            </h2>
          </div>
          <CategoryPicker categories={pickerCategories} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          DENSE DIRECTORY GRID
          ══════════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            badge="All Verticals"
            title="The full directory."
            description="Tap any sector to explore the sub-industries we build for."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {entries.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <motion.div
                  key={ind.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: (i % 10) * 0.03 }}
                >
                  <Link
                    href={`/industries/${ind.id}`}
                    className="group flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-card transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                      <Icon className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <span className="text-xs md:text-sm font-display font-semibold text-foreground leading-tight">
                      {ind.title}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ANIMATED STATS STRIP
          ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 section-alt">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
            <CountUp value="20+" label="Industry Verticals" />
            <CountUp value="200+" label="Sub-Industry Pages" />
            <CountUp value="50+" label="Projects Delivered" />
            <CountUp value="5" label="Countries Served" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CROSS-INDUSTRY EXPERTISE — divider layout
          ══════════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground leading-tight">
              Domain knowledge meets <span className="text-gradient">engineering excellence.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {[
              {
                num: "01",
                title: "We learn your domain",
                body: "Before writing a line of code, we study your industry's compliance landscape, user expectations, and competitive dynamics.",
              },
              {
                num: "02",
                title: "We build to your standards",
                body: "HIPAA for healthcare. PCI-DSS for finance. GDPR for EU markets. Compliance is architected in — not bolted on.",
              },
              {
                num: "03",
                title: "We measure what matters",
                body: "Every project tracks industry-specific KPIs — patient outcomes, cart conversion, fleet utilization — not vanity metrics.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="px-0 md:px-8 py-8 md:py-4"
              >
                <span className="text-xs font-mono text-primary tabular-nums mb-3 block">
                  {item.num}
                </span>
                <h4 className="font-display font-bold text-foreground text-xl md:text-2xl mb-3 leading-tight">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FAQ
          ══════════════════════════════════════════════ */}
      <section className="section-padding section-alt">
        <div className="container mx-auto px-4 md:px-6">
          <CategoryFAQ items={faqs} title="Industry questions, answered." />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FINAL CTA
          ══════════════════════════════════════════════ */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full bg-gradient-to-br from-primary/20 via-accent/15 to-transparent blur-3xl" />
        </div>
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 leading-[1.05] tracking-tight">
              Don't see your industry?{" "}
              <span className="text-gradient italic">We still build for you.</span>
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
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Industries;
