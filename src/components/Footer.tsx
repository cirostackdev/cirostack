"use client";

import Link from "next/link";
import Image from "next/image";
import { Linkedin, Instagram, Facebook, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { HIDE_CASE_STUDIES } from "@/lib/feature-flags";

const footerColumns = [
  {
    title: "Who we are",
    links: [
      { label: "Our Company", path: "/about" },
      { label: "Our Culture", path: "/our-culture" },
      { label: "Sustainability", path: "/sustainability" },
      { label: "Careers", path: "/careers" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Startup Branding", path: "/services/startup-branding" },
      { label: "UX & UI Design Services", path: "/services/ux-ui-design" },
      { label: "Cloud Consulting & Services", path: "/services/cloud-consulting" },
      { label: "Mobile Apps Development Services", path: "/services/apps" },
      { label: "Generative AI Development Services", path: "/services/ai" },
      { label: "AI & ML Development Services", path: "/services/ai-ml" },
      { label: "DevOps Consulting Services", path: "/services/devops" },
      { label: "Software Auditing Services", path: "/services/software-auditing" },
      { label: "US Nearshore Software Development", path: "/services/nearshore" },
      { label: "Software Development Outsourcing", path: "/services/outsourcing" },
      { label: "Dedicated Development Teams", path: "/services/dedicated-teams" },
    ],
  },
  {
    title: "Insights",
    links: [
      { label: "Blog", path: "/blog" },
      ...(!HIDE_CASE_STUDIES ? [{ label: "Case Studies", path: "/portfolio" }] : []),
      { label: "Resources", path: "/resources" },
      { label: "Events", path: "/events" },
      { label: "Newsroom", path: "/newsroom" },
    ],
  },
];

const startupsColumns = [
  {
    title: "By Stage",
    links: [
      { label: "Pre-Idea Exploration", path: "/startups/pre-idea" },
      { label: "Validation Stage", path: "/startups/validation" },
      { label: "MVP Development", path: "/startups/mvp" },
      { label: "Early Traction", path: "/startups/early-traction" },
      { label: "Seed Stage", path: "/startups/seed-stage" },
      { label: "Growth Stage", path: "/startups/growth" },
      { label: "Scale-Up", path: "/startups/scale-up" },
    ],
  },
  {
    title: "By Vertical",
    links: [
      { label: "AI Startups", path: "/startups/ai-startup" },
      { label: "Fintech Startups", path: "/startups/fintech" },
      { label: "Healthtech Startups", path: "/startups/healthtech" },
      { label: "Edtech Startups", path: "/startups/edtech" },
      { label: "Proptech Startups", path: "/startups/proptech" },
      { label: "Legaltech Startups", path: "/startups/legaltech" },
      { label: "Logistics & Supply Chain", path: "/startups/logistics-tech" },
      { label: "E-commerce & Retail", path: "/startups/ecommerce" },
      { label: "B2B SaaS", path: "/startups/b2b-saas" },
      { label: "Consumer Apps", path: "/startups/consumer-apps" },
    ],
  },
  {
    title: "By Product Type",
    links: [
      { label: "Web Application", path: "/startups/web-app" },
      { label: "Mobile App", path: "/startups/mobile-app" },
      { label: "AI-Powered Product", path: "/startups/ai-product" },
      { label: "SaaS Platform", path: "/startups/saas-platform" },
      { label: "Marketplace", path: "/startups/marketplace" },
      { label: "API Product", path: "/startups/api-product" },
    ],
  },
  {
    title: "By Founder Type",
    links: [
      { label: "Non-Technical Founder", path: "/startups/non-technical-founder" },
      { label: "First-Time Founder", path: "/startups/first-time-founder" },
      { label: "Solo Founder", path: "/startups/solo-founder" },
      { label: "Repeat Founder", path: "/startups/repeat-founder" },
      { label: "Student Startup", path: "/startups/student-startup" },
      { label: "Corporate Innovator", path: "/startups/corporate-innovator" },
      { label: "Female-Led Startup", path: "/startups/female-led" },
      { label: "African Startup", path: "/startups/african-startup" },
      { label: "Diaspora Founder", path: "/startups/diaspora-founder" },
      { label: "Social Enterprise", path: "/startups/social-enterprise" },
    ],
  },
  {
    title: "By Challenge",
    links: [
      { label: "Need an MVP Fast", path: "/startups/fast-mvp" },
      { label: "Outgrowing Current Tech", path: "/startups/scaling-tech" },
      { label: "Agency Rescue", path: "/startups/agency-rescue" },
      { label: "Preparing for Funding", path: "/startups/fundraising-ready" },
      { label: "Adding AI Features", path: "/startups/ai-integration" },
      { label: "Crushing Tech Debt", path: "/startups/tech-debt" },
      { label: "Post-Pivot Rebuild", path: "/startups/post-pivot" },
      { label: "No In-House Tech Team", path: "/startups/no-tech-team" },
      { label: "Launching in Africa", path: "/startups/africa-launch" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="section-alt">
      {/* Newsletter CTA */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-8 text-center md:text-left">
            <div className="max-w-lg">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                Stay ahead of the curve
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Get the latest insights on software development, AI, and digital transformation delivered to your inbox.
              </p>
            </div>
            <Link href="/newsletter">
              <Button size="lg" className="rounded-full px-8 text-base">
                Subscribe to Newsletter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Desktop: top row — Brand | Who we are | Services (×2) | Insights */}
        <div className="hidden md:grid md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-10 mb-14">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image src={logo} alt="CiroStack logo" width={32} height={32} className="object-contain" />
              <span className="font-display font-bold text-xl text-foreground">
                Ciro<span className="text-primary">Stack</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              We build websites, apps & AI tools for growing businesses. Fixed-price development, no surprises.
            </p>
            <div className="flex gap-3">
              <a href="https://linkedin.com/company/cirostack" className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
              <a href="https://instagram.com/cirostack" className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="https://facebook.com/cirostack" className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors" aria-label="Facebook">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Who we are */}
          <div>
            <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider mb-5">
              {footerColumns[0].title}
            </h4>
            <div className="flex flex-col gap-3">
              {footerColumns[0].links.map((link) => (
                <Link key={link.path} href={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services — first half */}
          <div>
            <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider mb-5">
              {footerColumns[1].title}
            </h4>
            <div className="flex flex-col gap-3">
              {footerColumns[1].links.slice(0, 6).map((link) => (
                <Link key={link.path} href={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services — second half */}
          <div>
            <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider mb-5">
              {footerColumns[1].title}
            </h4>
            <div className="flex flex-col gap-3">
              {footerColumns[1].links.slice(6).map((link) => (
                <Link key={link.path} href={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div>
            <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider mb-5">
              {footerColumns[2].title}
            </h4>
            <div className="flex flex-col gap-3">
              {footerColumns[2].links.map((link) => (
                <Link key={link.path} href={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: startups row — 6 sub-columns */}
        <div className="hidden md:block border-t border-border pt-12">
          <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-8">
            {startupsColumns.map((col) => (
              <div key={col.title}>
                <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider mb-5">
                  {col.title}
                </h4>
                <div className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <Link key={link.path} href={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: stacked */}
        <div className="md:hidden space-y-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image src={logo} alt="CiroStack logo" width={32} height={32} className="object-contain" />
              <span className="font-display font-bold text-xl text-foreground">
                Ciro<span className="text-primary">Stack</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              We build websites, apps & AI tools for growing businesses. Fixed-price development, no surprises.
            </p>
            <div className="flex gap-3">
              <a href="https://linkedin.com/company/cirostack" className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
              <a href="https://instagram.com/cirostack" className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="https://facebook.com/cirostack" className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors" aria-label="Facebook">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Who we are + Insights side by side */}
          <div className="grid grid-cols-2 gap-10">
            {[footerColumns[0], footerColumns[2]].map((col) => (
              <div key={col.title}>
                <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider mb-5">
                  {col.title}
                </h4>
                <div className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <Link key={link.path} href={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider mb-5">
              {footerColumns[1].title}
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {footerColumns[1].links.map((link) => (
                <Link key={link.path} href={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Startups: 2-col grid of sub-sections */}
          <div className="border-t border-border pt-10">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-8">Startups</p>
            <div className="grid grid-cols-2 gap-10">
              {startupsColumns.map((col) => (
                <div key={col.title}>
                  <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider mb-4">
                    {col.title}
                  </h4>
                  <div className="flex flex-col gap-2.5">
                    {col.links.map((link) => (
                      <Link key={link.path} href={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CiroStack. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <a
              href="mailto:contact@cirostack.com"
              className="text-xs text-primary hover:underline"
            >
              contact@cirostack.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
