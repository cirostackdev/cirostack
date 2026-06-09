"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, FileText, ArrowRight, Code, Bot, CheckCircle, X, Star } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import SectionHeading from "@/components/SectionHeading";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type DbResource = {
  id: string; type: string; title: string; description: string;
  pages: string; tags: string[]; isNew: boolean; imageUrl: string | null;
};

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const typeColors: Record<string, string> = {
    "Whitepaper": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    "Guide":      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    "Webinar":    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    "Video":      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    "Template":   "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    "Tool":       "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const tools = [
    { icon: Code,     title: "Project Estimate Calculator", description: "Get a rough estimate for your software project based on features and complexity.", href: "/resources/estimate" },
    { icon: Star,     title: "Tech Stack Decision Matrix",  description: "A framework for choosing the right technology stack for your next project.", href: null },
    { icon: FileText, title: "RFP Template",                description: "A professional Request for Proposal template for software development projects.", href: null },
    { icon: Bot,      title: "AI Readiness Assessment",     description: "Evaluate your organization's readiness to adopt AI automation tools.", href: null },
];

type DownloadState = "idle" | "submitting" | "done";

const Resources = ({ serverResources }: { serverResources: DbResource[] }) => {
    const [dialog, setDialog] = useState<{ open: boolean; title: string; type: string }>({ open: false, title: "", type: "" });
    const [dlEmail, setDlEmail] = useState("");
    const [dlState, setDlState] = useState<DownloadState>("idle");

    const featured = serverResources.filter(r => r.isNew);
    const rest = serverResources.filter(r => !r.isNew);

    const openDialog = (title: string, type: string) => {
        setDlEmail("");
        setDlState("idle");
        setDialog({ open: true, title, type });
    };

    const handleDownload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dlEmail) return;
        setDlState("submitting");
        try {
            await fetch("/api/resources/download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: dlEmail, resourceTitle: dialog.title, resourceType: dialog.type }),
            });
            setDlState("done");
        } catch {
            setDlState("done");
        }
    };

    // Counts by type for stats
    const typeCounts = serverResources.reduce<Record<string, number>>((acc, r) => {
        acc[r.type] = (acc[r.type] ?? 0) + 1;
        return acc;
    }, {});

    return (
        <Layout>
            <SEO
                title="Resources for Product Builders"
                description="Free guides, whitepapers, templates, and tools to help you make better software decisions."
                url="/resources"
            />

            {/* Featured — newest resources */}
            <section id="resources" className="section-padding mt-10">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading badge="Featured Resources" title="Most popular this month" description="Our highest-value resources, handpicked by our team." />

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center py-10 mb-10 border-y border-border">
                        {[
                            { value: String(serverResources.length),        label: "Total Resources" },
                            { value: String(typeCounts["Guide"] ?? 0),      label: "Guides" },
                            { value: String(typeCounts["Whitepaper"] ?? 0), label: "Whitepapers" },
                            { value: String(typeCounts["Template"] ?? 0),   label: "Templates" },
                        ].map((stat, i) => (
                            <motion.div key={stat.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                                <div className="text-4xl font-display font-bold text-foreground mb-2">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {featured.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {featured.map((resource, i) => (
                                <motion.div key={resource.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="group rounded-2xl surface-glass hover-lift overflow-hidden">
                                    {resource.imageUrl && (
                                        <div className="h-52 overflow-hidden bg-secondary">
                                            <img src={resource.imageUrl} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${typeColors[resource.type] ?? "bg-secondary text-muted-foreground"}`}>{resource.type}</span>
                                            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-md bg-secondary">New</span>
                                        </div>
                                        <h3 className="font-display font-semibold text-foreground text-xl mb-3 leading-snug group-hover:text-primary transition-colors">{resource.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{resource.description}</p>
                                        {resource.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-5">
                                                {resource.tags.map(tag => (
                                                    <span key={tag} className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">{resource.pages}</span>
                                            <button
                                                onClick={() => openDialog(resource.title, resource.type)}
                                                className="flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all"
                                            >
                                                <Download className="w-4 h-4" /> Download Free
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Rest — list layout */}
                    {rest.length > 0 && (
                        <div className="space-y-4">
                            {rest.map((resource, i) => (
                                <motion.div key={resource.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-6 rounded-2xl surface-glass hover-lift group flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="shrink-0">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${typeColors[resource.type] ?? "bg-secondary text-muted-foreground"}`}>{resource.type}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">{resource.title}</h3>
                                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                                        {resource.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {resource.tags.map(tag => (
                                                    <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col md:items-end gap-1.5 shrink-0">
                                        <span className="text-xs text-muted-foreground">{resource.pages}</span>
                                        <button
                                            onClick={() => openDialog(resource.title, resource.type)}
                                            className="flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all"
                                        >
                                            <Download className="w-3.5 h-3.5" /> Download
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {serverResources.length === 0 && (
                        <p className="text-center text-muted-foreground py-12">No resources available yet. Check back soon.</p>
                    )}
                </div>
            </section>

            {/* Interactive Tools */}
            <section className="section-padding section-alt">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading badge="Interactive Tools" title="Free tools to help you plan" description="Use these interactive tools to assess your needs and make better decisions." />
                    <div className="space-y-4">
                        {tools.map((tool, i) => (
                            <motion.div key={tool.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-6 rounded-2xl surface-glass hover-lift group flex flex-col md:flex-row md:items-center gap-4">
                                <div className="shrink-0">
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-muted-foreground">Tool</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">{tool.title}</h3>
                                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                                </div>
                                <div className="shrink-0">
                                    {tool.href ? (
                                        <Link href={tool.href} className="flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all">
                                            Try It Free <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => openDialog(tool.title, "Tool")}
                                            className="flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all"
                                        >
                                            Get Access <ArrowRight className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
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

            {/* Gated download dialog */}
            <Dialog open={dialog.open} onOpenChange={open => setDialog(d => ({ ...d, open }))}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-display">
                            {dlState === "done" ? "You're all set!" : "Get this resource free"}
                        </DialogTitle>
                    </DialogHeader>
                    {dlState === "done" ? (
                        <div className="text-center py-4">
                            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                            <p className="text-foreground font-medium mb-1">{dialog.title}</p>
                            <p className="text-sm text-muted-foreground">We'll send it to {dlEmail} within 24 hours. Check your inbox!</p>
                            <Button className="mt-6 w-full" onClick={() => setDialog(d => ({ ...d, open: false }))}>
                                Done <X className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-muted-foreground mb-1 line-clamp-2 font-medium">{dialog.title}</p>
                            <p className="text-sm text-muted-foreground mb-6">Enter your email and we'll send it straight to your inbox.</p>
                            <form onSubmit={handleDownload} className="space-y-4">
                                <input
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    value={dlEmail}
                                    onChange={e => setDlEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                />
                                <Button type="submit" className="w-full" disabled={dlState === "submitting"}>
                                    {dlState === "submitting" ? "Sending..." : "Send Me the Resource"} <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                            <p className="text-xs text-muted-foreground mt-3 text-center">No spam. Unsubscribe anytime.</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Layout>
    );
};

export default Resources;
