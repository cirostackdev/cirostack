"use client";

import { useMemo } from "react";
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
  DollarSign,
  Users,
  Zap,
  Shield,
  Sparkles,
  Scale,
  Film,
  Palmtree,
  Trophy,
  Car,
  HeartHandshake,
  HardHat,
  Sprout,
  Briefcase,
  Store,
} from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import SectionHeading from "@/components/SectionHeading";
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
import { projects, projectImages } from "@/data/caseStudies";
import { TestimonialsMarquee } from "@/components/TestimonialsMarquee";
import { allTestimonials } from "@/data/testimonials";
import HeroVisualStack from "@/components/home/HeroVisualStack";
import LifecycleTimeline from "@/components/home/LifecycleTimeline";
import BentoProjects from "@/components/home/BentoProjects";

/* ─── data ─── */
// Full pool of all 20 industries. Technology & Startups is index 0 (always pinned first in scroll).
const allIndustries = [
  { icon: Laptop, label: "Tech & Startups", title: "Technology & Startups", tagline: "From MVP to scale: engineering velocity for founders", href: "/industries/technology-and-startups", image: imgLaunchpad },
  { icon: HeartPulse, label: "Healthcare", title: "Healthcare & Medical", tagline: "HIPAA-compliant platforms for better patient outcomes", href: "/industries/healthcare-and-medical", image: imgHealthflow },
  { icon: Landmark, label: "Finance", title: "Financial Services", tagline: "Secure, real-time systems for modern finance", href: "/industries/financial-services", image: imgFinguard },
  { icon: ShoppingCart, label: "Retail", title: "Retail & E-Commerce", tagline: "Conversion-optimized storefronts and marketplaces", href: "/industries/retail-and-e-commerce", image: imgShoplocal },
  { icon: GraduationCap, label: "EdTech", title: "Education & E-Learning", tagline: "Scalable LMS for 50K+ concurrent learners", href: "/industries/education-and-e-learning", image: imgEduspark },
  { icon: Factory, label: "Manufacturing", title: "Manufacturing & Industrial", tagline: "IoT dashboards and predictive maintenance", href: "/industries/manufacturing-and-industrial", image: imgFactoryiq },
  { icon: Building2, label: "Real Estate", title: "Real Estate & Property", tagline: "PropTech platforms for listings, tours, transactions", href: "/industries/real-estate-and-property", image: imgPropview },
  { icon: Truck, label: "Logistics", title: "Transportation & Logistics", tagline: "Real-time tracking and supply chain intelligence", href: "/industries/transportation-and-logistics", image: imgLogistrack },
  { icon: Palmtree, label: "Hospitality", title: "Hospitality & Tourism", tagline: "Digital experiences as memorable as the destinations", href: "/industries/hospitality-and-tourism", image: imgTravelease },
  { icon: Scale, label: "Legal", title: "Legal Services", tagline: "Secure, efficient software for modern law firms", href: "/industries/legal-services", image: imgLegalshield },
  { icon: Landmark, label: "Government", title: "Government & Public Sector", tagline: "Accessible digital services for citizens and agencies", href: "/industries/government-and-public-sector", image: imgGovportal },
  { icon: Trophy, label: "Sports", title: "Sports & Recreation", tagline: "Fan engagement and facility management platforms", href: "/industries/sports-and-recreation", image: imgSportspulse },
  { icon: Sparkles, label: "Beauty", title: "Beauty & Personal Care", tagline: "Digital elegance for the beauty industry", href: "/industries/beauty-and-personal-care", image: imgBeautybook },
  { icon: Car, label: "Automotive", title: "Automotive", tagline: "Digital sales and service for the auto industry", href: "/industries/automotive", image: imgAutodrive },
  { icon: HeartHandshake, label: "Non-Profit", title: "Non-Profit & Social Enterprise", tagline: "Purpose-driven technology that amplifies your impact", href: "/industries/non-profit-and-social-enterprise", image: imgGivehub },
  { icon: Sprout, label: "Agriculture", title: "Agriculture & Farming", tagline: "AgriTech solutions for sustainable, data-driven farming", href: "/industries/agriculture-and-farming", image: imgAgriconnect },
  { icon: HardHat, label: "Construction", title: "Construction & Engineering", tagline: "Digital tools to manage complex projects on time and budget", href: "/industries/construction-and-engineering", image: imgBuildsite },
  { icon: Film, label: "Media", title: "Media & Entertainment", tagline: "Scalable content platforms that captivate global audiences", href: "/industries/media-and-entertainment", image: imgStreamdeck },
  { icon: Briefcase, label: "Professional Services", title: "Professional Services", tagline: "Streamlined software for consultancies, agencies, and firms", href: "/industries/professional-services", image: imgAutotask },
  { icon: Store, label: "Small Business", title: "Small Business", tagline: "Enterprise-grade technology scaled for local business growth", href: "/industries/small-business", image: imgSmallbizos },
];

const phases = [
  {
    name: "Ideate",
    services: [
      { label: "Startup Branding", href: "/services/startup-branding" },
      { label: "UX / UI Design", href: "/services/ux-ui-design" },
      { label: "Cloud Consulting", href: "/services/cloud-consulting" },
    ],
  },
  {
    name: "Build",
    services: [
      { label: "Custom Software", href: "/services/websites" },
      { label: "Startup Dev", href: "/services/startups" },
      { label: "Mobile Apps", href: "/services/apps" },
    ],
  },
  {
    name: "Improve",
    services: [
      { label: "Generative AI", href: "/services/ai" },
      { label: "AI & ML", href: "/services/ai-ml" },
      { label: "Digital Transformation", href: "/services/digital-transformation" },
    ],
  },
  {
    name: "Operate",
    services: [
      { label: "DevOps", href: "/services/devops" },
      { label: "Automation Testing", href: "/services/automation-testing" },
      { label: "Security Audits", href: "/services/security-audit" },
    ],
  },
  {
    name: "Scale",
    services: [
      { label: "Nearshore Dev", href: "/services/nearshore" },
      { label: "Outsourcing", href: "/services/outsourcing" },
      { label: "Dedicated Teams", href: "/services/dedicated-teams" },
    ],
  },
];


const values = [
  { icon: DollarSign, title: "Fixed Price", line: "The quote is the price. Period." },
  { icon: Users, title: "Senior Engineers", line: "The team you meet builds your product. No handoffs." },
  { icon: Zap, title: "Weeks, Not Months", line: "Most projects ship in 4–8 weeks." },
  { icon: Shield, title: "You Own Everything", line: "Code, designs, IP: yours from day one." },
];


/* Marquee strip: industry names scrolling (with links) */
const marqueeWords: { label: string; href: string }[] = [
  { label: "Healthcare", href: "/industries/healthcare-and-medical" },
  { label: "Fintech", href: "/industries/financial-services" },
  { label: "Retail", href: "/industries/retail-and-e-commerce" },
  { label: "Logistics", href: "/industries/transportation-and-logistics" },
  { label: "Manufacturing", href: "/industries/manufacturing-and-industrial" },
  { label: "EdTech", href: "/industries/education-and-e-learning" },
  { label: "PropTech", href: "/industries/real-estate-and-property" },
  { label: "SaaS", href: "/industries/technology-and-startups" },
  { label: "Hospitality", href: "/industries/hospitality-and-tourism" },
  { label: "Legal", href: "/industries/legal-services" },
  { label: "Government", href: "/industries/government-and-public-sector" },
  { label: "Media", href: "/industries/media-and-entertainment" },
  { label: "Agriculture", href: "/industries/agriculture-and-farming" },
  { label: "Automotive", href: "/industries/automotive" },
  { label: "Sports", href: "/industries/sports-and-recreation" },
];

/* ─── page ─── */
const Index = () => {
  const { scrollIndustries, alsoServe } = useMemo(() => {
    const pinned = allIndustries[0]; // Technology & Startups: always first
    const rest = [...allIndustries.slice(1)];
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    return {
      scrollIndustries: [pinned, ...rest.slice(0, 4)],
      alsoServe: rest.slice(4),
    };
  }, []);

  const featuredProjects = useMemo(() => {
    const allEntries = Object.entries(projects);
    // Fisher-Yates shuffle
    for (let i = allEntries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allEntries[i], allEntries[j]] = [allEntries[j], allEntries[i]];
    }
    return allEntries.slice(0, 5).map(([id, p]) => ({
      id,
      title: p.title,
      client: p.client,
      industry: p.industry,
      service: p.service,
      description: p.description,
      metric: p.metrics[0] ? `${p.metrics[0].value} ${p.metrics[0].label}` : "",
      tags: [p.category],
      image: projectImages[id],
    }));
  }, []);

  return (
    <Layout>
      <SEO />

      {/* ══════════════════════════════════════════════
          SECTION 1: SPLIT EDITORIAL HERO
          ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-24 md:pt-24 pb-0 lg:h-screen lg:min-h-[760px] lg:flex lg:flex-col">
        {/* Ambient backdrop */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:flex-1 lg:flex lg:items-center lg:min-h-0 lg:py-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-12 items-center w-full">
            {/* LEFT: text */}
            <div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-[4.5rem] xl:text-[5.5rem] font-display font-bold text-foreground leading-[0.95] tracking-tight mb-5"
              >
                Software,
                <br />
                <span className="text-gradient italic">engineered</span>
                <br />
                for your industry.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-base md:text-lg text-muted-foreground mb-6 max-w-xl leading-relaxed"
              >
                Fixed price. Senior engineers. Shipped in weeks.
                From websites to AI: across 20+ industries.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex flex-wrap gap-4 mb-8"
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

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-6 text-sm"
              >
                {[
                  { value: "50+", label: "Projects" },
                  { value: "20+", label: "Industries" },
                  { value: "5", label: "Countries" },
                ].map((s, i) => (
                  <div key={s.label} className="flex items-center gap-6">
                    <div>
                      <p className="text-2xl md:text-3xl font-display font-bold text-foreground tabular-nums">
                        {s.value}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        {s.label}
                      </p>
                    </div>
                    {i < 2 && <span className="h-8 w-px bg-border" />}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT: visual stack */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <HeroVisualStack image={imgHealthflow} />
            </motion.div>
          </div>
        </div>

        {/* Scrolling marquee */}
        <div className="mt-10 lg:mt-0 border-y border-border/60 bg-card/40 backdrop-blur-sm py-4 overflow-hidden relative flex">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-background to-transparent" />
          {[0, 1].map((track) => (
            <div
              key={track}
              aria-hidden={track === 1}
              className="flex shrink-0 animate-marquee-track"
              style={{
                "--marquee-duration": "40s",
                animationDelay: track === 1 ? "-20s" : "0s",
              } as React.CSSProperties}
            >
              {marqueeWords.map((w, i) => (
                <Link
                  key={i}
                  href={w.href}
                  className="inline-flex items-center mx-8 text-2xl md:text-3xl font-display font-semibold text-muted-foreground/70 hover:text-foreground transition-colors shrink-0"
                >
                  {w.label}
                  <span className="ml-8 text-primary text-3xl">·</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2: SERVICES (lifecycle timeline)
          ══════════════════════════════════════════════ */}
      <section className="section-padding section-alt">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            badge="What We Do"
            title="From first idea to global scale."
            description="19 services across 5 phases of a startup's software lifecycle. Whatever stage you're at, we meet you there."
          />

          <LifecycleTimeline phases={phases} />

          <div className="text-center mt-16 space-y-4">
            <Link href="/contact">
              <Button className="rounded-full px-8" size="lg">
                Get a quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 3: INDUSTRIES (horizontal showcase)
          ══════════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_2fr] gap-12 mb-12">
            {/* Big number */}
            <div>
              <p className="text-7xl md:text-8xl lg:text-9xl font-display font-bold text-gradient leading-none mb-3 tabular-nums">
                20+
              </p>
              <p className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-4 leading-tight">
                Built for your world,
                <br />
                <span className="text-muted-foreground">not ours.</span>
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md">
                We learn your regulations, your users, your market: then build software that fits.
              </p>
            </div>

            {/* Horizontal scroll showcase */}
            <div className="relative min-w-0 -mr-4 md:-mr-6 lg:-mr-12">
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 pr-4 md:pr-6 lg:pr-12 scrollbar-thin">
                {scrollIndustries.map((ind) => (
                  <Link
                    key={ind.title}
                    href={ind.href}
                    className="block group flex-none w-[260px] md:w-[280px] snap-start"
                  >
                    <div className="rounded-2xl overflow-hidden surface-glass hover-lift">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={ind.image}
                          alt={ind.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <ind.icon className="w-4 h-4 text-primary" />
                          </div>
                          <h3 className="font-display font-semibold text-foreground text-base leading-tight">{ind.title}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{ind.tagline}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Also serve pill cloud */}
          <div className="text-center pt-6 border-t border-border/60">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              We also serve
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {alsoServe.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-muted/80 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 4: FEATURED WORK (bento)
          ══════════════════════════════════════════════ */}
      <section id="featured-work" className="section-padding section-alt">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            badge="Our Work"
            title="Results that speak for themselves."
            description="A small sample. The full portfolio has 25 case studies."
          />

          <BentoProjects projects={featuredProjects} />

          <div className="text-center mt-10">
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
          SECTION 5: WHY FIXED PRICE
          ══════════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: narrative */}
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight mb-6">
                No hourly billing.
                <br />
                <span className="text-gradient">No surprises.</span>
                <br />
                No excuses.
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10">
                Most agencies bill by the hour: which means the longer your project takes,
                the more they earn. We flipped that. You get a fixed price before we write
                a single line of code. If we go over, that's on us. Not you.
              </p>

              {/* Animated payment timeline */}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">
                  Payment milestones
                </p>
                <div className="relative px-1">
                  {/* Background rail */}
                  <div className="absolute top-5 left-6 right-6 h-1 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1.6, ease: [0.25, 0.4, 0.25, 1] }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                  <div className="relative flex justify-between gap-1">
                    {[
                      { pct: "30%", label: "Upfront" },
                      { pct: "30%", label: "Design OK" },
                      { pct: "30%", label: "Dev done" },
                      { pct: "10%", label: "Launch" },
                    ].map((step, i) => (
                      <motion.div
                        key={step.label}
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.4, delay: 0.4 * i + 0.3 }}
                        className="flex-1 min-w-0 text-center"
                      >
                        <div className="w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center mx-auto mb-2 shadow-sm">
                          <span className="text-primary text-[10px] font-bold">{step.pct}</span>
                        </div>
                        <span className="block text-[11px] md:text-xs text-muted-foreground font-medium leading-tight break-words">{step.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 4 value cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="p-5 md:p-6 rounded-2xl border border-border bg-card hover-lift"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <v.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-display font-semibold text-foreground text-sm md:text-base mb-1.5">{v.title}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{v.line}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 6: TESTIMONIALS
          ══════════════════════════════════════════════ */}
      <TestimonialsMarquee
        items={allTestimonials}
        heading="What our partners say"
        subheading="Trusted by founders, CTOs, and engineering teams worldwide."
        sectionBg="bg-card"
      />

      {/* ══════════════════════════════════════════════
          SECTION 7: FINAL CTA (gradient orb)
          ══════════════════════════════════════════════ */}
      <section className="relative section-padding section-alt overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full bg-gradient-to-br from-primary/25 via-accent/15 to-transparent blur-3xl" />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-primary/15 blur-3xl" />
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
              Let's build something
              <br />
              that <span className="text-gradient italic">matters.</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-10 leading-relaxed max-w-xl mx-auto">
              Tell us about your project. We respond within 24 hours with a free, no-obligation quote.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="rounded-full text-base px-10 group">
                  Get a Free Quote
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-5">
              or email us at{" "}
              <a href="mailto:cirostack@gmail.com" className="text-primary hover:underline">
                cirostack@gmail.com
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
