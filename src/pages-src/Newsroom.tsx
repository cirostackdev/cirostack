"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Newspaper, ArrowRight, Calendar, Tag, ExternalLink, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
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

const companyNews: { id: string; type: NewsType; title: string; summary: string; full: string; date: string; source?: string; tag: string; featured: boolean; url?: string }[] = [
    {
        id: "seed-round",
        type: "Press Release",
        title: "CiroStack Raises $2.5M Seed Round to Accelerate AI-Powered Development",
        summary: "CiroStack today announced the close of its $2.5 million seed funding round led by Horizon Ventures, with participation from several top angel investors in the enterprise software space.",
        full: "CiroStack today announced the close of its $2.5 million seed funding round led by Horizon Ventures, with participation from several top angel investors in the enterprise software space. The funds will be used to expand the engineering team, deepen AI capabilities, and grow the company's client base across North America and Africa. \"This investment validates what we've always believed: that transparent, fixed-price software development is the future,\" said the CiroStack CEO. \"We're building infrastructure for the next generation of software-driven businesses.\"",
        date: "February 20, 2026",
        tag: "Funding",
        featured: true,
    },
    {
        id: "top-agency-award",
        type: "Award",
        title: "CiroStack Named 'Top Software Development Agency' by TechReview Annual Report",
        summary: "For the second consecutive year, CiroStack has been recognized as a top-tier software development agency for client satisfaction, delivery speed, and innovation.",
        full: "For the second consecutive year, CiroStack has been recognized as a top-tier software development agency by TechReview's Annual Report, which evaluates over 500 agencies globally on client satisfaction, on-time delivery, pricing transparency, and technical innovation. The recognition reflects CiroStack's fixed-price delivery model and its track record of zero budget overruns across 50+ client projects. \"Winning this two years in a row tells us we're doing the right things,\" said the Head of Delivery. \"Our clients trust us because we make and keep our promises.\"",
        date: "January 15, 2026",
        tag: "Recognition",
        featured: true,
    },
    {
        id: "forbes-feature",
        type: "Media Coverage",
        title: "Forbes: 'How CiroStack is Democratizing Enterprise Software'",
        summary: "A Forbes feature on how CiroStack is making enterprise-quality software development accessible to growing businesses with its fixed-price, transparent model.",
        full: "",
        date: "December 10, 2025",
        source: "Forbes",
        tag: "Media",
        featured: false,
        url: "https://forbes.com",
    },
    {
        id: "aws-partnership",
        type: "Partnership",
        title: "CiroStack Partners with AWS to Offer Certified Cloud Migration Services",
        summary: "CiroStack is now an official AWS Partner, enabling us to offer certified cloud migration and infrastructure services to our growing base of enterprise clients.",
        full: "",
        date: "November 28, 2025",
        tag: "Partnership",
        featured: false,
    },
    {
        id: "ai-division",
        type: "Press Release",
        title: "CiroStack Launches AI Development Services Division",
        summary: "CiroStack formally launched its AI & Machine Learning development services division, expanding capabilities to serve clients seeking intelligent automation solutions.",
        full: "",
        date: "October 5, 2025",
        tag: "Product",
        featured: false,
    },
    {
        id: "techcrunch-feature",
        type: "Media Coverage",
        title: "TechCrunch: 'Meet the Agency Disrupting Enterprise Software Delivery'",
        summary: "TechCrunch profiles CiroStack's unique approach to fixed-price software development and how it's winning over Fortune 500 clients.",
        full: "",
        date: "September 22, 2025",
        source: "TechCrunch",
        tag: "Media",
        featured: false,
        url: "https://techcrunch.com",
    },
];

const tagColors: Record<string, string> = {
    Funding: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Recognition: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    Media: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    Partnership: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    Product: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const stats = [
    { value: "40+", label: "Press Mentions" },
    { value: "15+", label: "Industry Awards" },
    { value: "8", label: "Strategic Partnerships" },
    { value: "3", label: "Funding Rounds" },
];

type LiveArticle = {
    title: string;
    description: string;
    url: string;
    image: string | null;
    publishedAt: string;
    source: string;
    type: "guardian" | "hackernews";
    hnPoints?: number;
    hnComments?: number;
};

const Newsroom = () => {
    const featured = companyNews.filter(n => n.featured);
    const rest = companyNews.filter(n => !n.featured);
    const router = useRouter();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [liveNews, setLiveNews] = useState<LiveArticle[]>([]);
    const [newsLoading, setNewsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/news")
            .then(r => r.json())
            .then(data => setLiveNews(Array.isArray(data) ? data : []))
            .catch(() => setLiveNews([]))
            .finally(() => setNewsLoading(false));
    }, []);

    const formatDate = (iso: string) => {
        try {
            return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        } catch {
            return iso;
        }
    };

    return (
        <Layout>
            <SEO
                title="Newsroom: Press and Announcements"
                description="Latest company news, press releases, media features, and industry recognition for CiroStack."
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

            {/* Company Announcements */}
            <section className="section-padding">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading badge="Company News" title="Our announcements" description="Funding, awards, partnerships, and milestones from the CiroStack team." />

                    {/* Featured — expand in place */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {featured.map((item, i) => (
                            <motion.div key={item.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-8 rounded-2xl surface-glass group">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${tagColors[item.tag] || "bg-secondary text-muted-foreground"}`}>{item.tag}</span>
                                    <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-md bg-secondary">{item.type}</span>
                                </div>
                                <h3 className="font-display font-semibold text-foreground text-xl mb-3 leading-snug">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                    {expandedId === item.id && item.full ? item.full : item.summary}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{item.date}</span>
                                    </div>
                                    {item.full && (
                                        <button
                                            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                            className="flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all"
                                        >
                                            {expandedId === item.id ? (
                                                <>Read Less <ChevronUp className="w-4 h-4" /></>
                                            ) : (
                                                <>Read More <ChevronDown className="w-4 h-4" /></>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Rest of company news */}
                    <div className="space-y-4">
                        {rest.map((item, i) => (
                            <motion.div key={item.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-6 rounded-2xl surface-glass hover-lift group flex flex-col md:flex-row md:items-center gap-4">
                                <div className="shrink-0">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${tagColors[item.tag] || "bg-secondary text-muted-foreground"}`}>{item.tag}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-muted-foreground">{item.type}</span>
                                        {item.source && (<><span className="text-muted-foreground text-xs">·</span><span className="text-xs font-medium text-muted-foreground">{item.source}</span></>)}
                                    </div>
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.summary}</p>
                                </div>
                                <div className="flex flex-col md:items-end gap-1 shrink-0">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Calendar className="w-3.5 h-3.5" /><span>{item.date}</span>
                                    </div>
                                    {item.url && (
                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                                            <ExternalLink className="w-3 h-3" /> View Article
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Live Industry News */}
            <section className="section-padding section-alt">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading badge="Industry News" title="What's happening in tech" description="Live news relevant to startups, software development, AI, and the services we provide." />

                    {newsLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                        </div>
                    ) : liveNews.length === 0 ? (
                        <p className="text-center text-muted-foreground py-12">No articles available right now. Check back soon.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {liveNews.map((article, i) => (
                                <motion.div
                                    key={article.url}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeUp}
                                    custom={i}
                                    onClick={() => router.push(`/newsroom/article?src=${encodeURIComponent(article.url)}`)}
                                    className="block group rounded-2xl surface-glass hover-lift overflow-hidden cursor-pointer"
                                >
                                    {article.image && (
                                        <div className="h-40 overflow-hidden bg-secondary">
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${article.type === "guardian" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"}`}>
                                                {article.source}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{formatDate(article.publishedAt)}</span>
                                        </div>
                                        <h3 className="font-display font-semibold text-foreground text-base mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                                        {article.description && <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{article.description}</p>}
                                        {article.type === "hackernews" && article.hnPoints !== undefined && (
                                            <p className="text-xs text-muted-foreground mt-2">{article.hnPoints} points · {article.hnComments} comments</p>
                                        )}
                                        <div className="flex items-center gap-1.5 mt-4 text-sm text-primary font-medium">
                                            Read Article <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Press Contact */}
            <section className="section-padding text-center">
                <div className="container mx-auto px-4 md:px-6 max-w-2xl">
                    <Tag className="w-12 h-12 text-foreground mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Press & Media Inquiries</h2>
                    <p className="text-muted-foreground text-lg mb-4 max-w-lg mx-auto">Journalists, analysts, and media partners: we'd love to speak with you. Reach out for interviews, quotes, and exclusive briefings.</p>
                    <p className="text-muted-foreground mb-8">
                        Contact our press team at{" "}
                        <a href="mailto:contact@cirostack.com" className="text-primary hover:underline font-medium">contact@cirostack.com</a>
                    </p>
                    <Link href="/contact/press">
                        <Button size="lg">Contact Press Team <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </Link>
                </div>
            </section>
        </Layout>
    );
};

export default Newsroom;
