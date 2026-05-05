"use client";

import Link from "next/link";
import { Linkedin, Instagram, Facebook, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

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
      { label: "Custom Software Development", path: "/services/websites" },
      { label: "Software Development for Startups", path: "/services/startups" },
      { label: "Mobile Apps Development Services", path: "/services/apps" },
      { label: "Cloud Engineering Service", path: "/services/cloud-engineering" },
      { label: "Embedded Software Services", path: "/services/embedded-software" },
      { label: "Generative AI Development Services", path: "/services/ai" },
      { label: "AI & ML Development Services", path: "/services/ai-ml" },
      { label: "Data Engineering and Data Science", path: "/services/data-engineering" },
      { label: "Digital Transformation Solutions", path: "/services/digital-transformation" },
      { label: "DevOps Consulting Services", path: "/services/devops" },
      { label: "Automation Testing Services", path: "/services/automation-testing" },
      { label: "Software Auditing Services", path: "/services/software-auditing" },
      { label: "Identity and Access Management", path: "/services/iam" },
      { label: "Security Audit and Governance", path: "/services/security-audit" },
      { label: "US Nearshore Software Development", path: "/services/nearshore" },
      { label: "Software Development Outsourcing", path: "/services/outsourcing" },
      { label: "Dedicated Development Teams", path: "/services/dedicated-teams" },
    ],
  },
  {
    title: "Startups",
    links: [
      { label: "By Stage", path: "/startups/by-stage" },
      { label: "By Vertical", path: "/startups/by-vertical" },
      { label: "By Product Type", path: "/startups/by-product" },
      { label: "By Founder Type", path: "/startups/by-founder" },
      { label: "By Challenge", path: "/startups/by-challenge" },
      { label: "By Engagement", path: "/startups/by-engagement" },
    ],
  },
  {
    title: "Insights",
    links: [
      { label: "Blog", path: "/blog" },
      { label: "Case Studies", path: "/portfolio" },
      { label: "Resources", path: "/resources" },
      { label: "Events", path: "/events" },
      { label: "Newsroom", path: "/newsroom" },
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
        {/* Desktop layout */}
        <div className="hidden md:block space-y-12">
          {/* Top row: Brand + Who we are + Insights */}
          <div className="grid md:grid-cols-4 gap-10">
            {/* Brand Column */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-6">
                <img src={logo} alt="CiroStack logo" className="w-8 h-8 object-contain" />
                <span className="font-display font-bold text-xl text-foreground">
                  Ciro<span className="text-primary">Stack</span>
                </span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                We build websites, apps & AI tools for growing businesses. Fixed-price development, no surprises.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  aria-label="Facebook"
                >
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
                  <Link
                    key={link.path}
                    href={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div>
              <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider mb-5">
                {footerColumns[3].title}
              </h4>
              <div className="flex flex-col gap-3">
                {footerColumns[3].links.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row: Services + Industries (multi-column) */}
          <div className="grid md:grid-cols-2 gap-10">
            {/* Services */}
            <div>
              <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider mb-5">
                {footerColumns[1].title}
              </h4>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {footerColumns[1].links.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Industries */}
            <div>
              <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider mb-5">
                {footerColumns[2].title}
              </h4>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {footerColumns[2].links.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: compact stacked layout */}
        <div className="md:hidden space-y-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <img src={logo} alt="CiroStack logo" className="w-8 h-8 object-contain" />
              <span className="font-display font-bold text-xl text-foreground">
                Ciro<span className="text-primary">Stack</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              We build websites, apps & AI tools for growing businesses. Fixed-price development, no surprises.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Short columns side by side: Who we are + Insights */}
          <div className="grid grid-cols-2 gap-10">
            {[footerColumns[0], footerColumns[3]].map((col) => (
              <div key={col.title}>
                <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider mb-5">
                  {col.title}
                </h4>
                <div className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Services: full width, 2-column sub-grid */}
          <div>
            <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider mb-5">
              {footerColumns[1].title}
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {footerColumns[1].links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Industries: full width, 2-column sub-grid */}
          <div>
            <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider mb-5">
              {footerColumns[2].title}
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {footerColumns[2].links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
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
              href="mailto:cirostack@gmail.com"
              className="text-xs text-primary hover:underline"
            >
              cirostack@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
