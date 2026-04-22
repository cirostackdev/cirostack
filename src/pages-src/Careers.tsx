"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    Briefcase, MapPin, Clock, ArrowRight, Heart, Zap, Globe, Users,
    Star, CheckCircle, Code, Bot, Palette, BarChart
} from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import heroCareers from "@/assets/hero-careers.jpg";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

type Department = "All" | "Engineering" | "Design" | "AI/ML" | "Sales" | "Operations";

const openRoles: { title: string; department: Department; type: string; location: string; description: string }[] = [
    {
        title: "Senior Full-Stack Engineer",
        department: "Engineering",
        type: "Full-Time",
        location: "Remote",
        description: "Build scalable web applications using React, Node.js, and cloud infrastructure. Lead technical decisions and mentor juniors.",
    },
    {
        title: "AI/ML Engineer",
        department: "AI/ML",
        type: "Full-Time",
        location: "Remote",
        description: "Design and deploy machine learning models and AI automation pipelines. Work closely with enterprise clients on cutting-edge solutions.",
    },
    {
        title: "Senior Product Designer",
        department: "Design",
        type: "Full-Time",
        location: "Remote",
        description: "Lead UX/UI design across multiple client projects. Create intuitive, stunning interfaces and define our design systems.",
    },
    {
        title: "DevOps / Cloud Engineer",
        department: "Engineering",
        type: "Full-Time",
        location: "Remote",
        description: "Manage cloud infrastructure on AWS and GCP. Build CI/CD pipelines, ensure 99.99% uptime, and drive infrastructure-as-code practices.",
    },
    {
        title: "Business Development Manager",
        department: "Sales",
        type: "Full-Time",
        location: "Remote / US",
        description: "Own the full sales cycle for mid-market and enterprise accounts. Drive pipeline growth and strategic partnerships.",
    },
    {
        title: "Technical Project Manager",
        department: "Operations",
        type: "Full-Time",
        location: "Remote",
        description: "Coordinate cross-functional teams to deliver client projects on time and budget. Be the bridge between clients and engineering.",
    },
    {
        title: "React Native Developer (Contract)",
        department: "Engineering",
        type: "Contract",
        location: "Remote",
        description: "Build mobile apps for iOS and Android using React Native. Work on 3–6 month project engagements with exceptional clients.",
    },
    {
        title: "Junior AI Researcher",
        department: "AI/ML",
        type: "Full-Time",
        location: "Remote",
        description: "A great opportunity for a recent grad or career-switcher to enter the AI field. Support our ML engineering team on applied AI projects.",
    },
];

const deptIcons: Partial<Record<Department, React.ElementType>> = {
    Engineering: Code,
    "AI/ML": Bot,
    Design: Palette,
    Sales: BarChart,
    Operations: Briefcase,
};

const perks = [
    { icon: Globe, label: "Fully Remote", sub: "Work from anywhere" },
    { icon: Heart, label: "Health Benefits", sub: "Full coverage" },
    { icon: Zap, label: "Learning Budget", sub: "$1,500/year" },
    { icon: Users, label: "Team Retreats", sub: "Annual company offsite" },
    { icon: Star, label: "Equity Options", sub: "Everyone shares success" },
    { icon: Clock, label: "Flexible Hours", sub: "Own your schedule" },
];

const process = [
    { step: "01", title: "Apply Online", description: "Submit your application with a resume and a brief intro about why you want to join CiroStack." },
    { step: "02", title: "Intro Call", description: "A 30-minute video chat with our talent team to learn more about you and share details about the role." },
    { step: "03", title: "Technical or Portfolio Review", description: "Role-specific assessment — a technical challenge, portfolio review, or case study depending on the position." },
    { step: "04", title: "Team Interviews", description: "Meet the team you'd work with. We keep this to 2 rounds max — we respect your time." },
    { step: "05", title: "Offer & Onboarding", description: "If it's a match, you'll receive an offer within 48 hours and a smooth, structured onboarding experience." },
];

const Careers = () => {
    const [activeFilter, setActiveFilter] = useState<Department>("All");
    const departments: Department[] = ["All", "Engineering", "Design", "AI/ML", "Sales", "Operations"];

    const filtered = activeFilter === "All" ? openRoles : openRoles.filter(r => r.department === activeFilter);

    return (
        <Layout>
            <SEO
                title="Careers at CiroStack"
                description="Join our remote-first team of engineers, designers, and problem solvers. View open roles at CiroStack."
                url="/careers"
            />
            <PageHero
                badge="Careers"
                title="Build the future with"
                highlight="CiroStack"
                description="We're a remote-first team of builders, designers, and problem-solvers. If you love great software and meaningful work, you might be exactly who we're looking for."
                image={heroCareers}
                ctaText="See Open Roles"
                ctaLink="#roles"
                secondaryCtaText="Our Culture"
                secondaryCtaLink="/our-culture"
            />

            {/* Stats */}
            <section className="py-16 border-y border-border section-alt">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: "30+", label: "Team Members" },
                            { value: "18+", label: "Countries" },
                            { value: "4.9★", label: "Glassdoor Rating" },
                            { value: "96%", label: "Team Satisfaction" },
                        ].map((s, i) => (
                            <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                                <div className="text-4xl font-display font-bold text-foreground mb-2">{s.value}</div>
                                <div className="text-sm text-muted-foreground">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Roles */}
            <section id="roles" className="section-padding">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading badge="Open Roles" title={`${openRoles.length} open positions`} description="We're growing fast and looking for exceptional talent. All roles are remote-first." />

                    {/* Filter */}
                    <div className="flex flex-wrap gap-3 justify-center mb-10">
                        {departments.map((dept) => (
                            <button
                                key={dept}
                                onClick={() => setActiveFilter(dept)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === dept ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {filtered.map((role, i) => {
                            const DeptIcon = deptIcons[role.department] || Briefcase;
                            return (
                                <motion.div key={role.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-6 rounded-2xl surface-glass hover-lift group flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                        <DeptIcon className="w-6 h-6 text-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">{role.title}</h3>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{role.type}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                            <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {role.department}</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {role.location}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{role.description}</p>
                                    </div>
                                    <div className="shrink-0">
                                        <Link href="/contact">
                                            <Button size="sm">
                                                Apply <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-muted-foreground">
                            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p>No open roles in this department right now. Check back soon or join our talent network.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Perks */}
            <section className="section-padding section-alt">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading badge="Benefits & Perks" title="We take care of our people" description="Great talent deserves great benefits. Here's what you can expect." />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {perks.map((perk, i) => (
                            <motion.div key={perk.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-6 rounded-2xl surface-glass text-center">
                                <perk.icon className="w-8 h-8 text-foreground mx-auto mb-3" />
                                <p className="font-semibold text-foreground text-sm mb-1">{perk.label}</p>
                                <p className="text-xs text-muted-foreground">{perk.sub}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hiring Process */}
            <section className="section-padding">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading badge="Our Process" title="How we hire" description="A fair, fast, and transparent hiring process designed to respect your time." />
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {process.map((step, i) => (
                            <motion.div key={step.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="text-center">
                                <div className="w-12 h-12 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-bold mb-4">{step.step}</div>
                                <h4 className="font-display font-semibold text-foreground mb-2">{step.title}</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values reminder */}
            <section className="section-padding section-alt">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div>
                            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider uppercase rounded-full bg-muted text-muted-foreground border border-border">Equal Opportunity</span>
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">We hire on merit, period</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">CiroStack is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all team members regardless of background, identity, or experience.</p>
                            <p className="text-muted-foreground leading-relaxed">We strongly encourage applications from underrepresented groups in tech.</p>
                        </div>
                        <div className="space-y-3">
                            {["Inclusive hiring panels", "Blind resume screening available", "Accessibility accommodations provided", "Transparent pay ranges shared up-front", "Flexible interview scheduling"].map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                                    <span className="text-muted-foreground text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding text-center">
                <div className="container mx-auto px-4 md:px-6 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Don't see the right role?</h2>
                    <p className="text-muted-foreground text-lg mb-8">Send us your resume anyway. We keep a talent network for future openings and always love meeting great people.</p>
                    <Link href="/contact">
                        <Button size="lg">Send Open Application <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </Link>
                </div>
            </section>
        </Layout>
    );
};

export default Careers;
