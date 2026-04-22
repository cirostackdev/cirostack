"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Newspaper, ArrowRight, Calendar, Tag, ExternalLink } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import heroNewsroom from "@/assets/hero-newsroom.jpg";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

type NewsType = "Press Release" | "Media Coverage" | "Award" | "Partnership";

const news: { type: NewsType; title: string; summary: string; date: string; source?: string; tag: string; featured: boolean }[] = [
    {
        type: "Press Release",
        title: "CiroStack Raises $2.5M Seed Round to Accelerate AI-Powered Development",
        summary: "CiroStack today announced the close of its $2.5 million seed funding round led by Horizon Ventures, with participation from several top angel investors in the enterprise software space.",
        date: "February 20, 2026",
        tag: "Funding",
        featured: true,
    },
    {
        type: "Award",
        title: "CiroStack Named 'Top Software Development Agency' by TechReview Annual Report",
        summary: "For the second consecutive year, CiroStack has been recognized as a top-tier software development agency for client satisfaction, delivery speed, and innovation.",
        date: "January 15, 2026",
        tag: "Recognition",
        featured: true,
    },
    {
        type: "Media Coverage",
        title: "Forbes: 'How CiroStack is Democratizing Enterprise Software'",
        summary: "A Forbes feature on how CiroStack is making enterprise-quality software development accessible to growing businesses with its fixed-price, transparent model.",
        date: "December 10, 2025",
        source: "Forbes",
        tag: "Media",
        featured: false,
    },
    {
        type: "Partnership",
        title: "CiroStack Partners with AWS to Offer Certified Cloud Migration Services",
        summary: "CiroStack is now an official AWS Partner, enabling us to offer certified cloud migration and infrastructure services to our growing base of enterprise clients.",
        date: "November 28, 2025",
        tag: "Partnership",
        featured: false,
    },
    {
        type: "Press Release",
        title: "CiroStack Launches AI Development Services Division",
        summary: "CiroStack formally launched its AI & Machine Learning development services division, expanding capabilities to serve clients seeking intelligent automation solutions.",
        date: "October 5, 2025",
        tag: "Product",
        featured: false,
    },
    {
        type: "Media Coverage",
        title: "TechCrunch: 'Meet the Agency Disrupting Enterprise Software Delivery'",
        summary: "TechCrunch profiles CiroStack's unique approach to fixed-price software development and how it's winning over Fortune 500 clients.",
        date: "September 22, 2025",
        source: "TechCrunch",
        tag: "Media",
        featured: false,
    },
];

const tagColors: Record<string, string> = {
    Funding: "bg-green-100 text-green-800",
    Recognition: "bg-yellow-100 text-yellow-800",
    Media: "bg-blue-100 text-blue-800",
    Partnership: "bg-purple-100 text-purple-800",
    Product: "bg-red-100 text-red-800",
};

const stats = [
    { value: "40+", label: "Press Mentions" },
    { value: "15+", label: "Industry Awards" },
    { value: "8", label: "Strategic Partnerships" },
    { value: "3", label: "Funding Rounds" },
];

const Newsroom = () => {
    const featured = news.filter(n => n.featured);
    const rest = news.filter(n => !n.featured);

    return (
        <Layout>
            <SEO
                title="Newsroom - Press & Announcements"
                description="Latest company news, press releases, format features, and industry recognition for CiroStack."
                url="/newsroom"
            />
            <PageHero
                icon={Newspaper}
                title="Newsroom"
                description="The latest news, press releases, media coverage, and announcements from CiroStack."
                image={heroNewsroom}
                ctaText="Press Inquiries"
                ctaLink="/contact"
            />

            {/* Stats */}
            <section className="py-16 border-y border-border section-alt">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, i) => (
                            <motion.div key={stat.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                                <div className="text-4xl font-display font-bold text-foreground mb-2">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured News */}
            <section className="section-padding">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading badge="Latest News" title="Top stories" description="Our most significant recent announcements and media highlights." />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {featured.map((item, i) => (
                            <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-8 rounded-2xl surface-glass hover-lift group cursor-pointer">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${tagColors[item.tag] || "bg-secondary text-muted-foreground"}`}>{item.tag}</span>
                                    <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-md bg-secondary">{item.type}</span>
                                </div>
                                <h3 className="font-display font-semibold text-foreground text-xl mb-3 leading-snug group-hover:text-primary transition-colors">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{item.summary}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{item.date}</span>
                                    </div>
                                    <button className="flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all">
                                        Read More <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Rest of News */}
                    <div className="space-y-4">
                        {rest.map((item, i) => (
                            <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-6 rounded-2xl surface-glass hover-lift group flex flex-col md:flex-row md:items-center gap-4 cursor-pointer">
                                <div className="shrink-0">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${tagColors[item.tag] || "bg-secondary text-muted-foreground"}`}>{item.tag}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-muted-foreground">{item.type}</span>
                                        {item.source && (
                                            <><span className="text-muted-foreground text-xs">·</span><span className="text-xs font-medium text-muted-foreground">{item.source}</span></>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.summary}</p>
                                </div>
                                <div className="flex flex-col md:items-end gap-1 shrink-0">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{item.date}</span>
                                    </div>
                                    {item.source && (
                                        <div className="flex items-center gap-1 text-xs text-primary">
                                            <ExternalLink className="w-3 h-3" /> View Article
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Press Contact */}
            <section className="section-padding section-alt text-center">
                <div className="container mx-auto px-4 md:px-6 max-w-2xl">
                    <Tag className="w-12 h-12 text-foreground mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Press & Media Inquiries</h2>
                    <p className="text-muted-foreground text-lg mb-4 max-w-lg mx-auto">Journalists, analysts, and media partners — we'd love to speak with you. Reach out for interviews, quotes, and exclusive briefings.</p>
                    <p className="text-muted-foreground mb-8">
                        Contact our press team at{" "}
                        <a href="mailto:press@cirostack.com" className="text-primary hover:underline font-medium">press@cirostack.com</a>
                    </p>
                    <Link href="/contact">
                        <Button size="lg">Contact Press Team <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </Link>
                </div>
            </section>
        </Layout>
    );
};

export default Newsroom;
