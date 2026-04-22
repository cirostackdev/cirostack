"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  Building2, ArrowRight, CheckCircle, Star, Quote,
  Heart, Zap, Users, Target,
  Code2, Server, Globe, Brain,
} from "lucide-react";
import { allTestimonials } from "@/data/testimonials";
import { TestimonialsMarquee } from "@/components/TestimonialsMarquee";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import heroAbout from "@/assets/hero-about.jpg";
import whyFixedPrice from "@/assets/why-fixed-price.png";
import whySeniorTalent from "@/assets/why-senior-talent.png";
import whyOutcomeObsessed from "@/assets/why-outcome-obsessed.png";
import teamAbdullahi from "@/assets/team-abdullahi.png";
import teamSofia from "@/assets/team-sofia.png";
import teamJames from "@/assets/team-james.png";
import teamPriya from "@/assets/team-priya.png";
import bgLeadEngineer from "@/assets/bg-lead-engineer.png";
import bgDesignUx from "@/assets/bg-design-ux.png";
import bgAiMl from "@/assets/bg-ai-ml.png";
import bgDevops from "@/assets/bg-devops.png";
import teamKai from "@/assets/team-kai.png";
import bgFrontend from "@/assets/bg-frontend.png";

/* ─── Data ─────────────────────────────────────────────────────────────── */

const stats = [
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 30, suffix: "+", label: "Happy Clients" },
  { value: 5, suffix: "", label: "Countries Served" },
  { value: 3, suffix: "+", label: "Years in Business" },
  { value: 4, suffix: "–8 wk", label: "Avg. Delivery Time" },
  { value: 95, suffix: "%", label: "Client Retention" },
];

const whyUs = [
  {
    title: "Fixed price. The quote is the price.",
    description:
      "Every project starts with a detailed scope and a locked price. You know the exact cost before we write a single line of code. If we go over, that's on us — not you. No hourly billing, no surprise invoices, no change-order games.",
    points: [
      "Full scope document before you sign anything",
      "Overruns are our problem, not yours",
      "Milestone-based payments — never pay for work you haven't seen",
    ],
    image: whyFixedPrice,
    imageAlt: "Fixed-price transparent contracts",
  },
  {
    title: "The team you meet is the team that builds.",
    description:
      "Agency bait-and-switch is real: seniors pitch, juniors deliver. We don't do that. The engineer who scopes your project is the engineer who writes your code. You talk directly to your builder — not a project manager playing telephone.",
    points: [
      "Senior engineers on every project, no exceptions",
      "Direct Slack access to your engineer throughout",
      "Dedicated on-call window through your launch week",
    ],
    image: whySeniorTalent,
    imageAlt: "Senior engineering team collaborating",
  },
  {
    title: "We win when your metrics move.",
    description:
      "Writing code is the easy part. Writing code that actually grows your business is hard — and that's the only thing we care about. Before we design anything, we agree on the numbers that define success. After launch, we review them together. If something isn't working, we fix it.",
    points: [
      "Success metrics defined before kickoff",
      "30-day post-launch performance review included",
      "Iteration cycles available on retainer",
    ],
    image: whyOutcomeObsessed,
    imageAlt: "Business outcomes and metrics dashboard",
  },
];

const values = [
  {
    icon: Heart,
    title: "Quality First",
    description: "We don't cut corners. Clean code, thorough testing, proper documentation — because shortcuts today become support tickets tomorrow.",
    num: "01",
  },
  {
    icon: Zap,
    title: "Speed Matters",
    description: "Most projects ship in 4–8 weeks. Fast cycles, tight feedback loops, zero bureaucracy between your idea and a working product.",
    num: "02",
  },
  {
    icon: Users,
    title: "True Partnership",
    description: "We join your Slack, attend your standups, and care about your roadmap. We're the engineering team you always wanted — without the hiring overhead.",
    num: "03",
  },
  {
    icon: Target,
    title: "Results Over Output",
    description: "Every decision we make is filtered through one question: does this move the number that matters to your business?",
    num: "04",
  },
];

const techGroups = [
  { label: "Frontend", icon: Code2, items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { label: "Backend", icon: Server, items: ["Node.js", "Python", "PostgreSQL", "Docker"] },
  { label: "Cloud", icon: Globe, items: ["AWS", "Vercel", "Supabase", "Cloudflare"] },
  { label: "AI & Data", icon: Brain, items: ["OpenAI", "LangChain", "HuggingFace", "Pinecone"] },
];


const team = [
  {
    name: "Jessy Onah",
    role: "Founder & Lead Engineer",
    bio: "Full-stack architect with a decade of experience shipping scalable products. Sets the technical direction for every engagement.",
    photo: teamAbdullahi,
    bg: bgLeadEngineer,
    specs: ["System Architecture", "React / Node.js", "Technical Strategy"],
  },
  {
    name: "Sofia Ramirez",
    role: "Head of Design & UX",
    bio: "UX specialist who turns complex problems into elegant, intuitive interfaces. Believes great design is invisible.",
    photo: teamSofia,
    bg: bgDesignUx,
    specs: ["Product Design", "Design Systems", "User Research"],
  },
  {
    name: "James Okafor",
    role: "AI & ML Lead",
    bio: "Specialises in LLMs, NLP pipelines, and production-ready AI integrations that solve real business problems.",
    photo: teamJames,
    bg: bgAiMl,
    specs: ["LLM Integration", "Python / LangChain", "Data Pipelines"],
  },
  {
    name: "Priya Nair",
    role: "Backend & DevOps Engineer",
    bio: "Keeps things running fast and reliably. From database architecture to zero-downtime deployments on AWS.",
    photo: teamPriya,
    bg: bgDevops,
    specs: ["PostgreSQL / Docker", "AWS Infrastructure", "CI/CD Pipelines"],
  },
  {
    name: "Kai Tanaka",
    role: "Frontend Developer",
    bio: "Pixel-perfect UI builder obsessed with performance and accessibility. Turns Figma designs into buttery-smooth React interfaces.",
    photo: teamKai,
    bg: bgFrontend,
    specs: ["React / TypeScript", "UI Animation", "Accessibility"],
  },
];


/* ─── Animated Counter ──────────────────────────────────────────────────── */

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, target, { duration: 2, ease: "easeOut" });
    return controls.stop;
  }, [count, target]);

  useEffect(() => {
    return rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${v}${suffix}`;
    });
  }, [rounded, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

const About = () => {
  return (
    <Layout>
      <SEO
        title="Our Company"
        description="Learn about CiroStack — who we are, how we work, and why businesses trust us to build their most important software."
        url="/about"
      />

      {/* Hero */}
      <PageHero
        icon={Building2}
        title="About CiroStack"
        description="A small, senior engineering team that builds software for growing businesses. Fixed price, shipped in weeks, built to last."
        image={heroAbout}
        ctaText="Work With Us"
        ctaLink="/contact"
      />

      {/* Stats bar */}
      <section className="bg-card border-y border-border/40 py-14">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-4xl lg:text-5xl font-display font-bold text-primary">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-sm text-muted-foreground font-medium tracking-wide uppercase">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Story — two-column */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">The Story</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
              Why I started CiroStack
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I'm Jessy Onah. Before CiroStack, I spent years building software for other agencies — and
                watching the same pattern repeat. Clients got billed by the hour for work that dragged on,
                junior developers were swapped in after the pitch, and nobody tracked whether the product
                actually moved the needle for the business.
              </p>
              <p>
                I kept thinking: what if an agency just did the obvious right things? Quote a fixed price
                and stick to it. Put senior engineers on every project. Measure success by the client's
                metrics, not billable hours. So I built that agency.
              </p>
              <p>
                CiroStack is the company I wished existed when I was on the other side of the table. We're
                a small, senior team — remote-first, distributed across 5 countries — and we treat every
                client's product like our own. 50+ projects later, that approach hasn't changed.
              </p>
            </div>
            <p className="mt-6 text-foreground font-display font-semibold">
              — Jessy Onah, Founder
            </p>
            <Link href="/contact" className="inline-block mt-6">
              <Button>
                Start a Conversation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl surface-glass p-8"
          >
            <h4 className="font-display font-semibold text-foreground mb-5">How we work</h4>
            <div className="space-y-4">
              {[
                "Fixed price — you know the cost before we start",
                "Senior engineers on every project, no exceptions",
                "Weekly written progress updates",
                "Your code, your designs, your IP — always",
                "Direct Slack access to the engineer building your product",
                "30–90 day post-launch support included",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why partner with us — alternating rows (mirrors ReasonsToChoose) */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50 border-y border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
              Why partner with CiroStack?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              We're not a freelance marketplace. We're not an offshore factory. We're a senior
              engineering team that works as your in-house partner — without the overhead.
            </p>
          </div>

          <div className="grid gap-16">
            {whyUs.map((reason, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row gap-8 lg:gap-16 items-center ${idx % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
              >
                {/* Image */}
                <div className="w-full md:w-1/2 aspect-video rounded-3xl border border-border/50 overflow-hidden relative group">
                  <img
                    src={reason.image}
                    alt={reason.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                </div>

                <div className="w-full md:w-1/2">
                  <div className="text-muted-foreground font-bold text-xl mb-4 font-display">0{idx + 1}</div>
                  <h3 className="text-3xl font-bold mb-4">{reason.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">{reason.description}</p>
                  <div className="space-y-3">
                    {reason.points.map((pt) => (
                      <div key={pt} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-sm text-muted-foreground">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Core Values</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground">
              What drives every decision
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group relative p-8 rounded-2xl bg-card border-l-4 border-l-transparent border border-border/40 hover:border-l-primary hover:border-border/60 hover:shadow-md transition-all duration-300 overflow-hidden`}
              >
                {/* large faint number */}
                <span className="absolute top-4 right-6 text-7xl font-display font-black text-foreground/5 select-none leading-none">
                  {v.num}
                </span>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <v.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-foreground text-xl mb-2">{v.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 bg-card border-t border-border/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Our Stack</h2>
              <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground">
                Technologies we trust
              </h3>
            </div>
            <p className="text-muted-foreground text-base max-w-sm md:text-right">
              Modern, battle-tested tools chosen for reliability, scalability, and developer experience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {techGroups.map((group, gi) => (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: gi * 0.1 }}
                className="rounded-2xl border border-border/40 bg-background/60 overflow-hidden"
              >
                {/* Category header bar */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-border/40 bg-primary/5">
                  <group.icon className="w-5 h-5 text-foreground" />
                  <span className="font-display font-bold text-sm uppercase tracking-wider text-foreground">{group.label}</span>
                </div>
                {/* Tech pills */}
                <div className="flex flex-wrap gap-3 p-6">
                  {group.items.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 rounded-xl border border-border/50 bg-card text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">The Team</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground">
              The people behind the code
            </h3>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl">
              A small, senior team — no juniors passed off as leads, no outsourcing without your knowledge.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border/40 bg-card overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Banner — role-relevant bg image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={member.bg}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  {/* Avatar — fully inside the banner, bottom-left */}
                  <div className="absolute bottom-4 left-6">
                    <div className="w-24 h-24 rounded-full border-4 border-white/20 overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                </div>
                {/* Body */}
                <div className="px-7 pt-6 pb-7">
                  <h4 className="font-display font-bold text-foreground text-xl leading-snug">{member.name}</h4>
                  <p className="text-sm text-muted-foreground font-semibold mt-1 mb-4">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{member.bio}</p>
                  {/* Spec tags */}
                  <div className="flex flex-wrap gap-2">
                    {member.specs.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full text-xs font-medium border border-border/50 bg-secondary text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TODO: Uncomment when real testimonials are collected
      <TestimonialsMarquee
        items={allTestimonials}
        heading="What our partners say"
        subheading="Engineering excellence verified across every industry we serve."
        duration="auto"
      />
      */}

      {/* CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Ready to build something great?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Book a free consultation and we'll scope your project, no strings attached.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg">
                Get a Free Quote <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline">
                View Our Work
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
