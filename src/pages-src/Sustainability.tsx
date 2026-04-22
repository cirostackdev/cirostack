"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    Leaf, Zap, Recycle, Globe, Heart, Sun, Wind, ArrowRight, CheckCircle, TreePine
} from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import heroSustainability from "@/assets/hero-sustainability.jpg";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const pillars = [
    {
        icon: Sun,
        title: "Carbon Neutral by 2026",
        description: "We're committed to fully offsetting our carbon footprint through verified carbon credits and renewable energy investments.",
        progress: 72,
    },
    {
        icon: Wind,
        title: "100% Renewable Energy",
        description: "All our cloud infrastructure runs on data centers powered by renewable energy. We partner only with climate-committed providers.",
        progress: 100,
    },
    {
        icon: TreePine,
        title: "10,000 Trees Planted",
        description: "For every project delivered, we plant trees through our partnership with One Tree Planted. We've already surpassed 8,000.",
        progress: 80,
    },
    {
        icon: Recycle,
        title: "Zero E-Waste",
        description: "We responsibly recycle all hardware and encourage team members to do the same with a dedicated e-waste reimbursement program.",
        progress: 90,
    },
];

const actions = [
    "Remote-first culture eliminates daily commute emissions company-wide",
    "Annual carbon footprint audit from certified third-party provider",
    "Paperless operations — fully digital contracts, invoices, and communications",
    "Sustainable vendor partnerships and procurement policies",
    "Team education on sustainable practices and environmental impact",
    "Donations of 1% of annual revenue to environmental nonprofits",
];

const sdgs = [
    { number: "7", title: "Affordable and Clean Energy", color: "bg-yellow-500" },
    { number: "9", title: "Industry, Innovation & Infrastructure", color: "bg-orange-500" },
    { number: "12", title: "Responsible Consumption", color: "bg-amber-700" },
    { number: "13", title: "Climate Action", color: "bg-green-700" },
    { number: "17", title: "Partnerships for the Goals", color: "bg-blue-800" },
];

const Sustainability = () => {
    return (
        <Layout>
            <SEO
                title="Our Sustainability Promise"
                description="Learn about CiroStack's commitment to building software while reducing our environmental impact."
                url="/sustainability"
            />
            <PageHero
                badge="Sustainability"
                title="Tech with a"
                highlight="purpose"
                description="Building great software and a better planet aren't mutually exclusive. Here's our commitment to operating responsibly and reducing our environmental impact."
                image={heroSustainability}
                ctaText="Our Commitments"
                ctaLink="#commitments"
                secondaryCtaText="Contact Us"
                secondaryCtaLink="/contact"
            />

            {/* Intro */}
            <section className="section-padding">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
                            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider uppercase rounded-full bg-muted text-muted-foreground border border-border">
                                Our Approach
                            </span>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                                Sustainability is not a checkbox
                            </h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    We believe technology companies have a responsibility to lead by example. At CiroStack, sustainability
                                    isn't a marketing initiative — it's woven into how we operate every day.
                                </p>
                                <p>
                                    From our remote-first culture that eliminates commute emissions, to our partnerships with green cloud
                                    providers, every decision we make factors in our environmental impact.
                                </p>
                                <p>
                                    We publish a transparent sustainability report annually so our clients, partners, and team can hold us
                                    accountable to our goals.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            custom={1}
                            className="grid grid-cols-2 gap-4"
                        >
                            {[
                                { value: "8,247", label: "Trees Planted", icon: TreePine },
                                { value: "72%", label: "Carbon Neutral Progress", icon: Leaf },
                                { value: "100%", label: "Renewable Cloud Infra", icon: Wind },
                                { value: "1%", label: "Revenue to Environment", icon: Heart },
                            ].map((stat) => (
                                <div key={stat.label} className="p-6 rounded-2xl surface-glass text-center">
                                    <stat.icon className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                                    <div className="text-3xl font-display font-bold text-foreground mb-1">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Pillars with progress */}
            <section id="commitments" className="section-padding section-alt">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading
                        badge="Our Commitments"
                        title="Four pillars of sustainability"
                        description="Specific, measurable goals we're working toward — and our progress against each one."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pillars.map((pillar, i) => (
                            <motion.div
                                key={pillar.title}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                                className="p-8 rounded-2xl surface-glass"
                            >
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <pillar.icon className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-semibold text-foreground text-lg mb-2">{pillar.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Progress</span>
                                        <span className={`font-semibold ${pillar.progress >= 90 ? 'text-emerald-600' : pillar.progress >= 60 ? 'text-amber-600' : 'text-amber-600'}`}>{pillar.progress}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${pillar.progress}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                                            className={`h-full rounded-full ${pillar.progress >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Actions */}
            <section className="section-padding">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <SectionHeading
                                badge="Day-to-Day Actions"
                                title="How we live it daily"
                                description="Big goals are achieved through consistent small actions. Here are the practices embedded in our daily operations."
                            />
                        </div>
                        <div className="space-y-4">
                            {actions.map((action, i) => (
                                <motion.div
                                    key={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeUp}
                                    custom={i}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground text-sm leading-relaxed">{action}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* UN SDGs */}
            <section className="section-padding section-alt">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <SectionHeading
                        badge="Global Goals"
                        title="UN Sustainable Development Goals"
                        description="We align our sustainability strategy with the United Nations' Sustainable Development Goals."
                    />
                    <div className="flex flex-wrap justify-center gap-4">
                        {sdgs.map((sdg) => (
                            <div key={sdg.number} className={`${sdg.color} rounded-xl p-4 w-32 text-white text-center`}>
                                <div className="text-3xl font-display font-bold mb-1">{sdg.number}</div>
                                <div className="text-xs leading-tight">{sdg.title}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding text-center">
                <div className="container mx-auto px-4 md:px-6">
                    <Globe className="w-12 h-12 text-emerald-600 mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                        Let's build a better future together
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                        Partner with a technology company that takes its social and environmental responsibility seriously.
                    </p>
                    <Link href="/contact">
                        <Button size="lg">
                            Start a Conversation <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>
        </Layout>
    );
};

export default Sustainability;
