"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  HeartPulse,
  Landmark,
  ShoppingCart,
  GraduationCap,
  Factory,
  Laptop,
  Building2,
  Truck,
  Globe,
  Smartphone,
  Bot,
  DollarSign,
  Users,
  Zap,
  Shield,
} from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import SectionHeading from "@/components/SectionHeading";
import imgHealthflow from "@/assets/portfolio-healthflow.jpg";
import imgShoplocal from "@/assets/portfolio-shoplocal.jpg";
import imgAutotask from "@/assets/portfolio-autotask.jpg";
import { TestimonialsMarquee } from "@/components/TestimonialsMarquee";
import { allTestimonials } from "@/data/testimonials";

/* ─── animation (hero only) ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

/* ─── data ─── */
const industries = [
  { icon: HeartPulse, title: "Healthcare & Medical", tagline: "HIPAA-compliant platforms for better patient outcomes", href: "/industries/healthcare-and-medical" },
  { icon: Landmark, title: "Financial Services", tagline: "Secure, real-time systems for modern finance", href: "/industries/financial-services" },
  { icon: ShoppingCart, title: "Retail & E-Commerce", tagline: "Conversion-optimized storefronts and marketplaces", href: "/industries/retail-and-e-commerce" },
  { icon: GraduationCap, title: "Education & E-Learning", tagline: "Scalable LMS platforms for 50K+ concurrent learners", href: "/industries/education-and-e-learning" },
  { icon: Factory, title: "Manufacturing", tagline: "IoT dashboards and predictive maintenance systems", href: "/industries/manufacturing-and-industrial" },
  { icon: Laptop, title: "Technology & Startups", tagline: "From MVP to scale — engineering velocity for founders", href: "/industries/technology-and-startups" },
  { icon: Building2, title: "Real Estate", tagline: "PropTech platforms for listings, tours, and transactions", href: "/industries/real-estate-and-property" },
  { icon: Truck, title: "Logistics", tagline: "Real-time tracking and supply chain intelligence", href: "/industries/transportation-and-logistics" },
];

const phases = [
  {
    name: "Ideate",
    services: [
      { label: "AI Consultation", href: "/services/ai" },
      { label: "Startup Strategy", href: "/services/startups" },
      { label: "Digital Transformation", href: "/services/digital-transformation" },
    ],
  },
  {
    name: "Build",
    services: [
      { label: "Websites", href: "/services/websites" },
      { label: "Mobile Apps", href: "/services/apps" },
      { label: "UX / UI Design", href: "/services/ux-ui-design" },
    ],
  },
  {
    name: "Improve",
    services: [
      { label: "Cloud Consulting", href: "/services/cloud-consulting" },
      { label: "Cloud Engineering", href: "/services/cloud-engineering" },
    ],
  },
  {
    name: "Operate",
    services: [
      { label: "Data Engineering", href: "/services/data-engineering" },
      { label: "Identity & Access", href: "/services/iam" },
      { label: "Security Audits", href: "/services/security-audit" },
    ],
  },
  {
    name: "Scale",
    services: [
      { label: "Dedicated Teams", href: "/services/dedicated-teams" },
      { label: "Nearshore Dev", href: "/services/nearshore" },
      { label: "QA & Testing", href: "/services/automation-testing" },
      { label: "Software Auditing", href: "/services/software-auditing" },
    ],
  },
];

const projects = [
  {
    title: "HealthFlow Dashboard",
    client: "MedTech Startup",
    industry: "Healthcare",
    metric: "60% less admin time",
    tags: ["Web App", "AI"],
    image: imgHealthflow,
  },
  {
    title: "ShopLocal Marketplace",
    client: "Retail Collective",
    industry: "Retail",
    metric: "₦60M in 90-day GMV",
    tags: ["E-commerce", "Marketplace"],
    image: imgShoplocal,
  },
  {
    title: "AutoTask AI",
    client: "Operations Corp",
    industry: "Enterprise",
    metric: "75% less manual work",
    tags: ["AI", "Automation"],
    image: imgAutotask,
  },
];

const values = [
  { icon: DollarSign, title: "Fixed Price", line: "The quote is the price. Period." },
  { icon: Users, title: "Senior Engineers", line: "The team you meet builds your product. No handoffs to juniors." },
  { icon: Zap, title: "Weeks, Not Months", line: "Most projects ship in 4–8 weeks. We move fast without cutting corners." },
  { icon: Shield, title: "You Own Everything", line: "Code, designs, IP — all yours from day one. No lock-in." },
];

const alsoServe = [
  "Legal", "Government", "Agriculture", "Construction", "Media",
  "Hospitality", "Sports", "Beauty", "Automotive", "Non-Profit",
  "Professional Services", "Small Business",
];

/* ─── page ─── */
const Index = () => {
  return (
    <Layout>
      <SEO />

      {/* ══════════════════════════════════════════════
          SECTION 1 — HERO
          ══════════════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Eyebrow */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase rounded-full bg-primary/8 text-primary border border-primary/15">
                Software Agency for Growing Businesses
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-[1.08] tracking-tight mb-6"
            >
              We design, build, and scale
              <br />
              <span className="text-gradient">software for your industry.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="text-base md:text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Fixed price. Senior engineers. Shipped in weeks.
              <br className="hidden sm:block" />
              From websites to AI — across 20+ industries.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              <Link href="/contact">
                <Button size="lg" className="rounded-full text-base px-8 group">
                  Start Your Project
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#featured-work">
                <Button size="lg" variant="outline" className="rounded-full text-base px-8">
                  See Our Work
                </Button>
              </Link>
            </motion.div>

            {/* Stat pills */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={4}
              className="flex flex-wrap justify-center gap-3 md:gap-4"
            >
              {[
                { value: "50+", label: "Projects" },
                { value: "20+", label: "Industries" },
                { value: "5", label: "Countries" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-muted/60 border border-border/60"
                >
                  <span className="text-primary font-display font-bold text-lg">{stat.value}</span>
                  <span className="text-muted-foreground text-sm">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2 — INDUSTRIES
          ══════════════════════════════════════════════ */}
      <section className="section-padding section-alt">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            badge="Industries We Serve"
            title="Built for your world, not ours."
            description="We don't just write code — we learn your regulations, your users, your market dynamics. Then we build software that fits."
          />

          {/* Industry grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10">
            {industries.map((ind) => (
              <Link key={ind.title} href={ind.href} className="block group">
                <div className="h-full p-5 md:p-6 rounded-xl surface-glass hover-lift">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <ind.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-sm md:text-base mb-1.5">
                    {ind.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {ind.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Also serve */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              We also serve:{" "}
              {alsoServe.map((name, i) => (
                <span key={name}>
                  {name}
                  {i < alsoServe.length - 1 && <span className="mx-1">·</span>}
                </span>
              ))}
            </p>
            <Link
              href="/industries"
              className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              Explore all industries <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 3 — SERVICES (5-phase lifecycle)
          ══════════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            badge="What We Do"
            title="From first idea to global scale."
            description="19 services across 5 phases of the software lifecycle. Whatever stage you're at, we meet you there."
          />

          {/* Gradient rail */}
          <div className="hidden md:block h-1 rounded-full bg-gradient-to-r from-primary to-accent mb-10 max-w-4xl mx-auto" />

          {/* Phases grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 lg:gap-6 mb-10">
            {phases.map((phase, pi) => (
              <div key={phase.name} className="relative">
                {/* Phase circle + name (desktop) */}
                <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-0 mb-4 md:mb-5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {pi + 1}
                  </div>
                  <h3 className="text-lg md:text-xl font-display font-bold text-foreground md:mt-3">
                    {phase.name}
                  </h3>
                </div>
                {/* Service links */}
                <ul className="space-y-2 pl-12 md:pl-0">
                  {phase.services.map((svc) => (
                    <li key={svc.label}>
                      <Link
                        href={svc.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group/svc"
                      >
                        {svc.label}
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/svc:opacity-100 group-hover/svc:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Pricing teaser */}
          <p className="text-center text-sm text-muted-foreground">
            Starting from <span className="text-foreground font-semibold">$2,500</span> · Fixed-price packages for every service.{" "}
            <Link href="/pricing" className="text-primary hover:underline font-medium">
              View pricing →
            </Link>
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 4 — FEATURED WORK
          ══════════════════════════════════════════════ */}
      <section id="featured-work" className="section-padding section-alt">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            badge="Our Work"
            title="Results that speak for themselves."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project.title} href="/portfolio" className="block group">
                <div className="rounded-2xl overflow-hidden surface-glass hover-lift">
                  {/* Image */}
                  <div className="relative h-52 md:h-48 lg:h-56 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Industry badge */}
                    <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-black/60 text-white backdrop-blur-sm">
                      {project.industry}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-xs text-muted-foreground font-medium mb-1">{project.client}</p>
                    <h3 className="font-display font-semibold text-foreground text-lg mb-3">{project.title}</h3>

                    {/* Metric badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(var(--trust)/0.1)] text-[hsl(var(--trust))] text-xs font-semibold mb-4">
                      <Zap className="w-3 h-3" />
                      {project.metric}
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/portfolio"
              className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all 25 projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 5 — WHY FIXED PRICE
          ══════════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left — narrative */}
            <div>
              <span className="inline-block px-3 py-1 mb-5 text-xs font-semibold tracking-widest uppercase rounded-full bg-muted text-muted-foreground border border-border">
                Why CiroStack
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight mb-6">
                No hourly billing.
                <br />
                <span className="text-gradient">No surprises.</span>
                <br />
                No excuses.
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
                Most agencies bill by the hour — which means the longer your project takes,
                the more they earn. We flipped that. You get a fixed price before we write
                a single line of code. If we go over, that's on us. Not you.
              </p>

              {/* Payment steps */}
              <div className="flex items-center gap-0">
                {[
                  { pct: "30%", label: "Upfront" },
                  { pct: "30%", label: "Design OK" },
                  { pct: "30%", label: "Dev done" },
                  { pct: "10%", label: "Launch" },
                ].map((step, i) => (
                  <div key={step.label} className="flex items-center">
                    <div className="text-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-1">
                        <span className="text-primary text-[10px] md:text-xs font-bold">{step.pct}</span>
                      </div>
                      <span className="text-[10px] md:text-xs text-muted-foreground">{step.label}</span>
                    </div>
                    {i < 3 && (
                      <div className="w-6 md:w-10 h-0.5 bg-primary/20 mx-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — 4 value cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((v) => (
                <div key={v.title} className="p-5 md:p-6 rounded-xl border border-border bg-card">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <v.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-display font-semibold text-foreground text-sm md:text-base mb-1.5">{v.title}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{v.line}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 6 — TESTIMONIALS
          ══════════════════════════════════════════════ */}
      <TestimonialsMarquee
        items={allTestimonials}
        heading="What our partners say"
        subheading="Trusted by founders, CTOs, and engineering teams worldwide."
        sectionBg="bg-card"
      />

      {/* ══════════════════════════════════════════════
          SECTION 7 — FINAL CTA
          ══════════════════════════════════════════════ */}
      <section className="section-padding section-alt">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Let's build something that{" "}
              <span className="text-gradient">matters.</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
              Tell us about your project. We respond within 24 hours with a free, no-obligation quote.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="rounded-full text-base px-8 group">
                  Get a Free Quote
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              or email us at{" "}
              <a href="mailto:contact@cirostack.com" className="text-primary hover:underline">
                contact@cirostack.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
