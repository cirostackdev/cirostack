"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Download, FileText, Video, ArrowRight, Code, Bot, Globe, Star } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import heroResources from "@/assets/hero-resources.jpg";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const categories = [
    { icon: FileText, label: "Whitepapers", count: 12 },
    { icon: BookOpen, label: "Guides", count: 24 },
    { icon: Video, label: "Webinars", count: 8 },
    { icon: Code, label: "Templates", count: 16 },
];

const featured = [
    {
        icon: Bot,
        type: "Whitepaper",
        title: "The Complete Guide to AI Automation for SMBs",
        description: "Everything you need to know about implementing AI automation in your business — from strategy to execution.",
        pages: "42 pages",
        tags: ["AI", "Automation", "Strategy"],
        isNew: true,
    },
    {
        icon: Globe,
        type: "Guide",
        title: "Website Performance Optimization Playbook",
        description: "Improve your Core Web Vitals, SEO score, and conversion rate with proven tactics from our engineering team.",
        pages: "28 pages",
        tags: ["Web", "Performance", "SEO"],
        isNew: false,
    },
    {
        icon: Code,
        type: "Template",
        title: "Software Project Brief Template",
        description: "Define your requirements clearly and get better quotes from any development partner.",
        pages: "8 pages",
        tags: ["Project Management", "Template"],
        isNew: false,
    },
    {
        icon: FileText,
        type: "Whitepaper",
        title: "Cloud Migration Strategy: A Technical Deep Dive",
        description: "A step-by-step technical guide to migrating your legacy infrastructure to modern cloud platforms.",
        pages: "56 pages",
        tags: ["Cloud", "DevOps"],
        isNew: true,
    },
    {
        icon: Bot,
        type: "Guide",
        title: "Building Your First MVP: Lessons from 50+ Projects",
        description: "Distilled insights from helping over 50 startups launch their first product.",
        pages: "34 pages",
        tags: ["MVP", "Startups"],
        isNew: false,
    },
    {
        icon: Globe,
        type: "Webinar",
        title: "Generative AI in Enterprise: Real-World Applications",
        description: "A recorded webinar discussing practical enterprise AI applications beyond the hype.",
        pages: "60 min",
        tags: ["AI", "Enterprise", "Video"],
        isNew: true,
    },
];

const tools = [
    { icon: Code, title: "Project Estimate Calculator", description: "Get a rough estimate for your software project based on features and complexity." },
    { icon: Star, title: "Tech Stack Decision Matrix", description: "A framework for choosing the right technology stack for your next project." },
    { icon: FileText, title: "RFP Template", description: "A professional Request for Proposal template for software development projects." },
    { icon: Bot, title: "AI Readiness Assessment", description: "Evaluate your organization's readiness to adopt AI automation tools." },
];

const Resources = () => {
    return (
        <Layout>
            <SEO
                title="Resources for Product Builders"
                description="Free guides, whitepapers, templates, and tools to help you make better software decisions."
                url="/resources"
            />
            <PageHero
                badge="Resources"
                title="Knowledge to help you"
                highlight="build better"
                description="Free guides, whitepapers, templates, and tools from the CiroStack team. Practical resources to help you make better technology decisions."
                image={heroResources}
                ctaText="Browse Resources"
                ctaLink="#resources"
                secondaryCtaText="Visit Our Blog"
                secondaryCtaLink="/blog"
            />

            <section className="py-12 border-y border-border section-alt">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((cat, i) => (
                            <motion.div key={cat.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-6 rounded-2xl surface-glass text-center hover-lift cursor-pointer">
                                <cat.icon className="w-8 h-8 text-foreground mx-auto mb-3" />
                                <p className="font-display font-semibold text-foreground">{cat.label}</p>
                                <p className="text-xs text-muted-foreground mt-1">{cat.count} available</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="resources" className="section-padding">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading badge="Featured Resources" title="Most popular this month" description="Our highest-value resources, handpicked by our team." />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featured.map((resource, i) => (
                            <motion.div key={resource.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-8 rounded-2xl surface-glass hover-lift group flex flex-col">
                                <div className="flex items-start justify-between mb-5">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <resource.icon className="w-6 h-6 text-foreground" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {resource.isNew && <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">New</span>}
                                        <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-md bg-secondary">{resource.type}</span>
                                    </div>
                                </div>
                                <h3 className="font-display font-semibold text-foreground text-lg mb-3 leading-snug">{resource.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{resource.description}</p>
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {resource.tags.map((tag) => (
                                        <span key={tag} className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">{tag}</span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">{resource.pages}</span>
                                    <button className="flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all">
                                        <Download className="w-4 h-4" /> Download Free
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-padding section-alt">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading badge="Interactive Tools" title="Free tools to help you plan" description="Use these interactive tools to assess your needs and make better decisions." />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tools.map((tool, i) => (
                            <motion.div key={tool.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-8 rounded-2xl surface-glass flex items-start gap-5 hover-lift group">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <tool.icon className="w-6 h-6 text-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-display font-semibold text-foreground text-lg mb-2">{tool.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{tool.description}</p>
                                    <button className="flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all">
                                        Try It Free <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-padding text-center">
                <div className="container mx-auto px-4 md:px-6 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Get new resources in your inbox</h2>
                    <p className="text-muted-foreground text-lg mb-8">Subscribe to our newsletter and be first to receive new guides and tools.</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/newsletter"><Button size="lg">Subscribe Free <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                        <Link href="/blog"><Button size="lg" variant="outline">Visit Blog</Button></Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Resources;
