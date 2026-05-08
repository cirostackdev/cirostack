"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects, projectImages } from "@/data/caseStudies";
import type { IndustryEntry } from "@/data/industries";
import { HIDE_CASE_STUDIES } from "@/lib/feature-flags";

interface RelatedCaseStudiesProps {
    industry: IndustryEntry;
}

export function RelatedCaseStudies({ industry }: RelatedCaseStudiesProps) {
    if (HIDE_CASE_STUDIES) return null;

    const allProjects = Object.entries(projects);

    const matched = allProjects.filter(([, p]) => p.industry === industry.title);

    // Fall back to B2B SaaS entries for non-vertical startup pages
    const displayProjects = matched.length >= 1
        ? matched.slice(0, 2)
        : allProjects.filter(([, p]) => p.industry === "B2B SaaS").slice(0, 2);

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
