"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects, projectImages } from "@/data/caseStudies";
import type { IndustryEntry } from "@/data/industries";
import { HIDE_CASE_STUDIES } from "@/lib/feature-flags";

interface RelatedCaseStudiesProps {
    industry: IndustryEntry;
}

// Maps startup slugs to the case study industry strings they should match
const STARTUP_SECTOR_MAP: Record<string, string[]> = {
    "fintech":              ["Financial Services"],
    "healthtech":           ["Healthcare", "Health & Fitness"],
    "edtech":               ["Education & E-Learning"],
    "proptech":             ["Real Estate & Property"],
    "legaltech":            ["Legal"],
    "ecommerce":            ["E-commerce", "Retail & E-Commerce"],
    "b2b-saas":             ["Enterprise", "Technology & Startups", "Professional Services"],
    "consumer-apps":        ["Hospitality & Tourism", "Sports & Recreation", "Beauty & Personal Care"],
    "logistics-tech":       ["Transportation & Logistics", "Manufacturing & Industrial"],
    "ai-startup":           ["Technology & Startups"],
    "ai-product":           ["Technology & Startups"],
    "saas-platform":        ["Technology & Startups", "Professional Services"],
    "marketplace":          ["E-commerce", "Retail & E-Commerce"],
    "web-app":              ["Technology & Startups"],
    "mobile-app":           ["Technology & Startups", "Health & Fitness"],
    "api-product":          ["Technology & Startups", "Professional Services"],
    "non-technical-founder":["Technology & Startups"],
    "first-time-founder":   ["Technology & Startups"],
    "solo-founder":         ["Technology & Startups"],
    "repeat-founder":       ["Technology & Startups"],
    "student-startup":      ["Technology & Startups", "Education & E-Learning"],
    "corporate-innovator":  ["Enterprise", "Professional Services"],
    "female-led":           ["Technology & Startups"],
    "african-startup":      ["Agriculture & Farming", "Technology & Startups"],
    "diaspora-founder":     ["Technology & Startups"],
    "social-enterprise":    ["Non-Profit & Social Enterprise"],
    "mvp":                  ["Technology & Startups"],
    "validation":           ["Technology & Startups"],
    "pre-idea":             ["Technology & Startups"],
    "early-traction":       ["Technology & Startups"],
    "seed-stage":           ["Technology & Startups"],
    "growth":               ["Technology & Startups"],
    "scale-up":             ["Technology & Startups"],
    "fast-mvp":             ["Technology & Startups"],
    "scaling-tech":         ["Technology & Startups"],
    "agency-rescue":        ["Technology & Startups"],
    "fundraising-ready":    ["Technology & Startups"],
    "ai-integration":       ["Technology & Startups"],
    "tech-debt":            ["Technology & Startups"],
    "post-pivot":           ["Technology & Startups"],
    "no-tech-team":         ["Technology & Startups"],
    "africa-launch":        ["Agriculture & Farming", "Technology & Startups"],
};

export function RelatedCaseStudies({ industry }: RelatedCaseStudiesProps) {
    if (HIDE_CASE_STUDIES) return null;

    const targetIndustries = STARTUP_SECTOR_MAP[industry.id] ?? [];
    const allProjects = Object.entries(projects);

    const matched = allProjects.filter(([, p]) =>
        targetIndustries.some(ind => p.industry === ind)
    );

    // Fall back to Technology & Startups entries if no specific match
    const displayProjects = matched.length >= 1
        ? matched.slice(0, 2)
        : allProjects.filter(([, p]) => p.industry === "Technology & Startups").slice(0, 2);

    if (displayProjects.length === 0) return null;

    return (
        <section className="py-24 bg-card border-t border-border/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
                            See how we've helped companies like yours
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Real projects. Measurable results.
                        </p>
                    </div>
                    <Link href="/portfolio" className="inline-flex items-center text-foreground font-semibold shrink-0 group px-6 py-3 rounded-full bg-muted hover:bg-secondary transition-colors">
                        View all case studies <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    {displayProjects.map(([slug, project]) => (
                        <Link href={`/portfolio/${slug}`} key={slug} className="group block">
                            <div className="overflow-hidden rounded-3xl mb-5 aspect-[16/9] border border-border/50 relative">
                                <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 mix-blend-overlay" />
                                <img
                                    src={projectImages[slug]}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                            <div className="flex gap-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                                <span>{project.client}</span>
                                <span className="opacity-40">•</span>
                                <span>{project.category}</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
                                {project.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {project.description}
                            </p>
                            {project.metrics[0] && (
                                <p className="text-sm font-semibold text-primary">
                                    {project.metrics[0].value} {project.metrics[0].label}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
