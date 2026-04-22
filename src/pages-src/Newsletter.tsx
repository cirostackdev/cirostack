"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, ArrowRight, Zap, BookOpen, Star, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import heroNewsletter from "@/assets/hero-newsletter.jpg";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const benefits = [
    { icon: Zap, title: "Weekly Insights", description: "Curated tech news, software trends, and actionable tips delivered every Tuesday." },
    { icon: BookOpen, title: "Exclusive Resources", description: "Subscribers get early access to our guides, whitepapers, and templates before anyone else." },
    { icon: Bot, title: "AI & Dev Deep Dives", description: "In-depth articles on AI, automation, and software development from our engineering team." },
    { icon: Star, title: "No Spam, Ever", description: "We respect your inbox. Crisp, high-value content only — unsubscribe anytime with one click." },
];

const pastIssues = [
    {
        issue: "#47",
        title: "Why AI won't replace your developers (but will change them)",
        date: "Feb 25, 2026",
        reads: "4.2K",
    },
    {
        issue: "#46",
        title: "The real cost of technical debt — and how to pay it down",
        date: "Feb 18, 2026",
        reads: "3.8K",
    },
    {
        issue: "#45",
        title: "5 questions to ask before hiring a software agency",
        date: "Feb 11, 2026",
        reads: "6.1K",
    },
    {
        issue: "#44",
        title: "Cloud-native vs. containerized: what's the difference?",
        date: "Feb 4, 2026",
        reads: "3.3K",
    },
];

const testimonials = [
    { quote: "The CiroStack newsletter is the only one I open every week. Always educational, never salesy.", name: "Jordan Lee", role: "Product Manager, GrowthLab" },
    { quote: "I've learned more about modern software dev from this newsletter than from any course.", name: "Priya Sharma", role: "Startup Founder" },
];

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) setSubmitted(true);
    };

    return (
        <Layout>
            <SEO
                title="CiroStack Digest Newsletter"
                description="Join 12,000+ readers getting weekly insights on software development, AI, and technology trends."
                url="/newsletter"
            />
            <PageHero
                badge="Newsletter"
                title="Stay sharp with the"
                highlight="CiroStack Digest"
                description="Join 12,000+ founders, engineers, and business leaders who read our weekly newsletter on technology, AI, and software development."
                image={heroNewsletter}
                ctaText="Subscribe Free"
                ctaLink="#subscribe"
            />

            {/* Subscribe Form */}
            <section id="subscribe" className="section-padding">
                <div className="container mx-auto px-4 md:px-6 max-w-xl text-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
                        {submitted ? (
                            <div className="p-10 rounded-2xl surface-glass">
                                <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
                                <h2 className="text-2xl font-display font-bold text-foreground mb-3">You're in!</h2>
                                <p className="text-muted-foreground">Welcome to the CiroStack Digest. Check your inbox for a confirmation email and your first welcome issue.</p>
                            </div>
                        ) : (
                            <div className="p-10 rounded-2xl surface-glass">
                                <Mail className="w-14 h-14 text-foreground mx-auto mb-6" />
                                <h2 className="text-2xl font-display font-bold text-foreground mb-3">Subscribe to the Digest</h2>
                                <p className="text-muted-foreground mb-8">Fresh every Tuesday morning. Join 12,000+ readers.</p>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                    />
                                    <Button type="submit" size="lg" className="w-full">
                                        Subscribe Free <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </form>
                                <p className="text-xs text-muted-foreground mt-4">No spam. Unsubscribe anytime. Privacy respected.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Benefits */}
            <section className="section-padding section-alt">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading badge="What You Get" title="Why 12,000+ people subscribe" description="No fluff. Just practical, well-researched content to keep you informed and ahead of the curve." />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((b, i) => (
                            <motion.div key={b.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-8 rounded-2xl surface-glass text-center hover-lift">
                                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                                    <b.icon className="w-6 h-6 text-foreground" />
                                </div>
                                <h3 className="font-display font-semibold text-foreground mb-2">{b.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Past Issues */}
            <section className="section-padding">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading badge="Past Issues" title="See what we write about" description="Browse some of our most-read recent issues before you subscribe." />
                    <div className="space-y-4">
                        {pastIssues.map((issue, i) => (
                            <motion.div key={issue.issue} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-6 rounded-2xl surface-glass flex items-center gap-5 hover-lift group cursor-pointer">
                                <span className="text-foreground font-display font-bold text-lg shrink-0 w-10">{issue.issue}</span>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{issue.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{issue.date} · {issue.reads} reads</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section-padding section-alt">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-8 rounded-2xl surface-glass">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
                                </div>
                                <blockquote className="text-foreground font-display italic mb-4">"{t.quote}"</blockquote>
                                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                                <p className="text-xs text-muted-foreground">{t.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Newsletter;
