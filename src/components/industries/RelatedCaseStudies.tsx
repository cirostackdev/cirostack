"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects, projectImages } from "@/data/caseStudies";
import type { IndustryEntry } from "@/data/industries";

interface RelatedCaseStudiesProps {
    industry: IndustryEntry;
}

export function RelatedCaseStudies({ industry }: RelatedCaseStudiesProps) {
    // Try to find projects related to this industry category. 
    // If none explicitly match by name, just grab the first two generic ones.
    const allProjects = Object.entries(projects);
    const matchedProjects = allProjects.filter(([_, project]) =>
        project.industry.toLowerCase().includes(industry.title.toLowerCase()) ||
        industry.title.toLowerCase().includes(project.industry.toLowerCase())
    );

    const displayProjects = matchedProjects.length >= 2
        ? matchedProjects.slice(0, 2)
        : allProjects.slice(0, 2);

    return (
        <section className="py-24 bg-card border-t border-border/50 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
                            See how we've helped companies like yours
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Explore our comprehensive portfolio of successful digital transformations and custom software projects.
                        </p>
                    </div>
                    <Link href="/portfolio" className="inline-flex items-center text-foreground font-semibold hover:underline shrink-0 group px-6 py-3 rounded-full bg-muted hover:bg-secondary transition-colors">
                        View all case studies <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    {displayProjects.map(([slug, project]) => (
                        <Link href={`/portfolio/${slug}`} key={slug} className="group block">
                            <div className="overflow-hidden rounded-3xl mb-6 aspect-[16/9] border border-border/50 relative">
                                <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 mix-blend-overlay" />
                                <img
                                    src={projectImages[slug]}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="flex gap-3 text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-3">
                                <span>{project.industry}</span>
                                <span className="text-muted-foreground opacity-50">•</span>
                                <span className="text-muted-foreground">{project.category}</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground group-hover:text-muted-foreground transition-colors leading-tight">
                                {project.title}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
