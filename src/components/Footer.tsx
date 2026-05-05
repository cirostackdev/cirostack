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
    title: "Industries",
    links: [
      { label: "Technology & Startups", path: "/industries/technology-and-startups" },
      { label: "Financial Services", path: "/industries/financial-services" },
      { label: "Healthcare & Medical", path: "/industries/healthcare-and-medical" },
      { label: "Retail & E-Commerce", path: "/industries/retail-and-e-commerce" },
      { label: "Education & E-Learning", path: "/industries/education-and-e-learning" },
      { label: "Professional Services", path: "/industries/professional-services" },
      { label: "Transportation & Logistics", path: "/industries/transportation-and-logistics" },
      { label: "Real Estate & Property", path: "/industries/real-estate-and-property" },
      { label: "Manufacturing & Industrial", path: "/industries/manufacturing-and-industrial" },
      { label: "Media & Entertainment", path: "/industries/media-and-entertainment" },
      { label: "Government & Public Sector", path: "/industries/government-and-public-sector" },
      { label: "Hospitality & Tourism", path: "/industries/hospitality-and-tourism" },
      { label: "Construction & Engineering", path: "/industries/construction-and-engineering" },
      { label: "Legal Services", path: "/industries/legal-services" },
      { label: "Small Business", path: "/industries/small-business" },
      { label: "Non-Profit & Social Enterprise", path: "/industries/non-profit-and-social-enterprise" },
      { label: "Sports & Recreation", path: "/industries/sports-and-recreation" },
      { label: "Automotive", path: "/industries/automotive" },
      { label: "Agriculture & Farming", path: "/industries/agriculture-and-farming" },
      { label: "Beauty & Personal Care", path: "/industries/beauty-and-personal-care" },
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
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

          {/* Link Columns */}
          {footerColumns.map((col) => (
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
