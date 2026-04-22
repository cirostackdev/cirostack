"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    Heart, Coffee, Globe, Zap, Music, Users, Star, ArrowRight,
    Laugh, BookOpen, Bike, Palette
} from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import heroCulture from "@/assets/hero-culture.jpg";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const values = [
    { icon: Heart, title: "People First", description: "We genuinely care about each team member's wellbeing, growth, and happiness — not just their output." },
    { icon: Zap, title: "Bias for Action", description: "We move fast, learn quickly from mistakes, and never let perfect be the enemy of great." },
    { icon: Globe, title: "Fully Remote", description: "Work from anywhere in the world. We trust our people to do great work wherever they are." },
    { icon: BookOpen, title: "Always Learning", description: "Dedicated time for courses, conferences, and experimentation. Growth is a company priority." },
    { icon: Laugh, title: "Embrace Fun", description: "We celebrate wins, laugh together, and maintain a spirit of play alongside serious work." },
    { icon: Users, title: "Radical Transparency", description: "We share our goals, metrics, and challenges openly. No hidden agendas, ever." },
];

const perks = [
    { icon: Coffee, label: "Flexible Hours", sub: "Own your schedule" },
    { icon: Bike, label: "Wellness Budget", sub: "$100/month" },
    { icon: BookOpen, label: "Learning Budget", sub: "$1,500/year" },
    { icon: Globe, label: "Work From Anywhere", sub: "Full remote support" },
    { icon: Palette, label: "Equipment Budget", sub: "Mac or PC, your choice" },
    { icon: Music, label: "Team Retreats", sub: "Annual company offsite" },
    { icon: Star, label: "Profit Sharing", sub: "Everyone shares in success" },
    { icon: Heart, label: "Health Benefits", sub: "Comprehensive coverage" },
];

const stats = [
    { value: "4.9★", label: "Glassdoor Rating" },
    { value: "96%", label: "Employee Satisfaction" },
    { value: "< 5%", label: "Annual Turnover" },
    { value: "18+", label: "Countries Represented" },
];

const OurCulture = () => {
    return (
        <Layout>
            <SEO
                title="Our Remote-First Culture"
                description="Discover CiroStack's remote-first culture built on trust, continuous learning, and big results."
                url="/our-culture"
            />
            <PageHero
                badge="Our Culture"
                title="Built by people who"
                highlight="love what they do"
                description="We're not just a company — we're a community. CiroStack is built on trust, creativity, and the belief that happy teams build extraordinary products."
                image={heroCulture}
                ctaText="View Open Roles"
                ctaLink="/careers"
                secondaryCtaText="Learn About Us"
                secondaryCtaLink="/about"
            />

            {/* Stats */}
            <section className="py-16 border-y border-border section-alt">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                            >
                                <div className="text-4xl font-display font-bold text-foreground mb-2">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section-padding">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading
                        badge="What We Believe"
                        title="Our cultural values"
                        description="These aren't just words on a wall. These principles shape every decision we make and every person we hire."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                                className="p-8 rounded-2xl surface-glass hover-lift group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                                    <v.icon className="w-6 h-6 text-foreground" />
                                </div>
                                <h3 className="font-display font-semibold text-foreground text-lg mb-3">{v.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Perks */}
            <section className="section-padding section-alt">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading
                        badge="Benefits & Perks"
                        title="We take care of our team"
                        description="Great people deserve great perks. Here's what you can expect when you join CiroStack."
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {perks.map((perk, i) => (
                            <motion.div
                                key={perk.label}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                                className="p-6 rounded-2xl surface-glass text-center"
                            >
                                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    <perk.icon className="w-6 h-6 text-foreground" />
                                </div>
                                <p className="font-display font-semibold text-foreground text-sm mb-1">{perk.label}</p>
                                <p className="text-xs text-muted-foreground">{perk.sub}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quote */}
            <section className="section-padding">
                <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex justify-center gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                            ))}
                        </div>
                        <blockquote className="text-2xl md:text-3xl font-display text-foreground leading-relaxed mb-6">
                            "CiroStack is the best place I've ever worked. The team culture is genuine, the work is meaningful, and leadership actually listens."
                        </blockquote>
                        <p className="font-semibold text-foreground">Marcus Williams</p>
                        <p className="text-sm text-muted-foreground">Senior Engineer, CiroStack</p>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding section-alt text-center">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                        Ready to join the team?
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                        We're always looking for talented, passionate people who want to do meaningful work.
                    </p>
                    <Link href="/careers">
                        <Button size="lg">
                            See Open Roles <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>
        </Layout>
    );
};

export default OurCulture;
