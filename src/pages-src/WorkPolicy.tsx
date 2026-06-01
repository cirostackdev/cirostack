"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    Clock, Shield, MessageSquare, Code2, Users, BookOpen,
    ArrowRight, CheckCircle, Globe, AlertTriangle, Briefcase,
    FileText, Scale
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

const principles = [
    { icon: Briefcase, title: "Ownership Over Attendance", description: "You own your deliverables. Nobody tracks your hours, but everybody sees your output." },
    { icon: Clock, title: "Ship, Don't Sit", description: "If you're blocked, say so immediately. Waiting silently is the worst thing you can do." },
    { icon: Scale, title: "Fixed Scope, Fixed Price", description: "Our business model depends on accurate scoping and efficient execution. Every hour wasted is our margin lost." },
];

const responseTimes = [
    { channel: "Slack (direct message)", time: "Within 2 hours", context: "During overlap window" },
    { channel: "Slack (channel mention)", time: "Within 4 hours", context: "Business hours" },
    { channel: "Email", time: "Within 24 hours", context: "Any time" },
    { channel: "Client-facing thread", time: "Within 4 hours", context: "Business hours" },
    { channel: "Production issue (on-call)", time: "Within 30 minutes", context: "24/7 rotation" },
];

const codeStandards = [
    "All code is reviewed before merge. No exceptions.",
    "Write tests for business logic. Minimum 80% coverage on critical paths.",
    "No code ships without passing CI. If CI is broken, fixing it is priority zero.",
    "Follow the project's established patterns. Consistency beats cleverness.",
    "Document 'why,' not 'what.' The code shows what it does. Comments explain decisions.",
];

const securityRules = [
    { icon: Shield, text: "Never commit secrets. No API keys, passwords, or tokens in code." },
    { icon: AlertTriangle, text: "Client data is sacred. Never share client code or credentials outside the assigned team." },
    { icon: Shield, text: "Use 2FA on everything. GitHub, Slack, email, cloud providers." },
    { icon: AlertTriangle, text: "Lock your machine. Report suspected breaches immediately." },
    { icon: Shield, text: "Personal devices must be encrypted. Full-disk encryption required." },
];

const definitionOfDone = [
    "Code is written, reviewed, and merged",
    "Tests pass in CI",
    "Deployed to staging and manually verified",
    "Documentation updated (if user-facing)",
    "Client notified (if visible to them)",
];

const conductRules = [
    "Give feedback on work, not on people.",
    "Code reviews are collaborative, not adversarial.",
    "Help when you can. Ask for help when you need it.",
    "No ego. The best idea wins, regardless of who said it.",
    "Never agree to a timeline you know is unrealistic just to win work.",
];

const zeroTolerance = [
    "Sharing client data or code without authorization",
    "Fabricating work or timesheets",
    "Harassment, discrimination, or bullying of any kind",
    "Deliberate sabotage of code, systems, or relationships",
    "Working on competing projects without disclosure",
];

const WorkPolicy = () => {
    return (
        <Layout>
            <SEO
                title="Work Policy | CiroStack"
                description="How we work at CiroStack. Our standards for communication, code quality, security, and professional conduct."
                url="/work-policy"
            />
            <PageHero
                badge="Work Policy"
                title="Work Policy"
                description="How we operate, what we expect, and what you can expect from us. Remote-first, ownership-driven, built on trust."
                image={heroCulture}
                ctaText="View Open Roles"
                ctaLink="/careers"
                secondaryCtaText="Our Culture"
                secondaryCtaLink="/our-culture"
            />

            {/* Core Principles */}
            <section className="section-padding">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading
                        title="Core principles"
                        description="Three rules that govern everything we do. If you remember nothing else, remember these."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {principles.map((p, i) => (
                            <motion.div
                                key={p.title}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                                className="p-8 rounded-2xl surface-glass hover-lift group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                                    <p.icon className="w-6 h-6 text-foreground" />
                                </div>
                                <h3 className="font-display font-semibold text-foreground text-lg mb-3">{p.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{p.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Work Hours & Availability */}
            <section className="section-padding section-alt">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading
                        title="Work hours and availability"
                        description="Remote-first doesn't mean offline-first. Here's how we stay connected."
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Overlap Window */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            custom={0}
                            className="p-8 rounded-2xl surface-glass"
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <Globe className="w-6 h-6 text-foreground" />
                                <h3 className="font-display font-semibold text-foreground text-lg">Overlap Window</h3>
                            </div>
                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-4">
                                <p className="text-2xl font-display font-bold text-foreground">10:00 AM to 2:00 PM WAT</p>
                                <p className="text-sm text-muted-foreground mt-1">Monday through Friday</p>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                All team members must be available during this window. This is when synchronous communication happens: standups, client calls, pair sessions. Outside the overlap window, work when you're most productive.
                            </p>
                        </motion.div>

                        {/* Response Times */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            custom={1}
                            className="p-8 rounded-2xl surface-glass"
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <MessageSquare className="w-6 h-6 text-foreground" />
                                <h3 className="font-display font-semibold text-foreground text-lg">Response Times</h3>
                            </div>
                            <div className="space-y-3">
                                {responseTimes.map((r) => (
                                    <div key={r.channel} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                        <span className="text-sm text-foreground">{r.channel}</span>
                                        <span className="text-sm font-medium text-primary">{r.time}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Communication */}
            <section className="section-padding">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading
                        title="Communication standards"
                        description="Default to async. Write it down. Make it searchable."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            custom={0}
                            className="p-8 rounded-2xl surface-glass"
                        >
                            <h3 className="font-display font-semibold text-foreground text-lg mb-4">Daily Standup Format</h3>
                            <div className="bg-secondary/50 rounded-xl p-5 font-mono text-sm text-foreground space-y-2">
                                <p><span className="text-primary font-semibold">Done:</span> [what you shipped yesterday]</p>
                                <p><span className="text-primary font-semibold">Today:</span> [what you're working on]</p>
                                <p><span className="text-primary font-semibold">Blocked:</span> [anything stopping progress, or "clear"]</p>
                            </div>
                            <p className="text-muted-foreground text-xs mt-3">Post in your project channel by 10:30 AM WAT. Keep it under 5 lines.</p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            custom={1}
                            className="p-8 rounded-2xl surface-glass"
                        >
                            <h3 className="font-display font-semibold text-foreground text-lg mb-4">Client Communication</h3>
                            <div className="space-y-3">
                                {[
                                    "Never surprise the client. If something is off-track, they hear it from us first.",
                                    "Weekly updates minimum, even if the update is 'on track, no blockers.'",
                                    "Use plain language. No jargon.",
                                    "Set expectations, then beat them.",
                                ].map((rule) => (
                                    <div key={rule} className="flex items-start gap-3">
                                        <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                        <span className="text-sm text-muted-foreground">{rule}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Code Quality & Delivery */}
            <section className="section-padding section-alt">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading
                        title="Code quality and delivery"
                        description="What 'done' means at CiroStack. No shortcuts, no excuses."
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            custom={0}
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <Code2 className="w-6 h-6 text-foreground" />
                                <h3 className="font-display font-semibold text-foreground text-lg">Code Standards</h3>
                            </div>
                            <div className="space-y-3">
                                {codeStandards.map((s) => (
                                    <div key={s} className="flex items-start gap-3">
                                        <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                        <span className="text-sm text-muted-foreground">{s}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            custom={1}
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <FileText className="w-6 h-6 text-foreground" />
                                <h3 className="font-display font-semibold text-foreground text-lg">Definition of Done</h3>
                            </div>
                            <p className="text-muted-foreground text-sm mb-4">A feature is done when all of these are true:</p>
                            <div className="space-y-3">
                                {definitionOfDone.map((d, i) => (
                                    <div key={d} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                                            {i + 1}
                                        </div>
                                        <span className="text-sm text-muted-foreground">{d}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Security */}
            <section className="section-padding">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading
                        title="Security and confidentiality"
                        description="Non-negotiable rules. These protect our clients, our team, and our reputation."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {securityRules.map((rule, i) => (
                            <motion.div
                                key={rule.text}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                                className="p-6 rounded-2xl surface-glass flex items-start gap-4"
                            >
                                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                                    <rule.icon className="w-5 h-5 text-red-600" />
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{rule.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Professional Conduct */}
            <section className="section-padding section-alt">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading
                        title="Professional conduct"
                        description="How we treat each other and our clients."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            custom={0}
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <Users className="w-6 h-6 text-foreground" />
                                <h3 className="font-display font-semibold text-foreground text-lg">Team Standards</h3>
                            </div>
                            <div className="space-y-3">
                                {conductRules.map((rule) => (
                                    <div key={rule} className="flex items-start gap-3">
                                        <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                        <span className="text-sm text-muted-foreground">{rule}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            custom={1}
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                                <h3 className="font-display font-semibold text-foreground text-lg">Zero Tolerance</h3>
                            </div>
                            <p className="text-muted-foreground text-sm mb-4">The following result in immediate termination:</p>
                            <div className="space-y-3">
                                {zeroTolerance.map((item) => (
                                    <div key={item} className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                        <span className="text-sm text-muted-foreground">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Growth */}
            <section className="section-padding">
                <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <BookOpen className="w-10 h-10 text-foreground mx-auto mb-5" />
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                            Growth and development
                        </h2>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            You are encouraged to spend up to 4 hours per week on professional development: courses, open source, writing, experimentation. This isn't tracked or mandated, but stagnation isn't acceptable either. Quarterly check-ins with the founder to discuss trajectory, satisfaction, and growth.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="px-5 py-3 rounded-xl bg-primary/5 border border-primary/20">
                                <p className="font-display font-bold text-foreground">4 hrs/week</p>
                                <p className="text-xs text-muted-foreground">Learning time</p>
                            </div>
                            <div className="px-5 py-3 rounded-xl bg-primary/5 border border-primary/20">
                                <p className="font-display font-bold text-foreground">Quarterly</p>
                                <p className="text-xs text-muted-foreground">Growth check-ins</p>
                            </div>
                            <div className="px-5 py-3 rounded-xl bg-primary/5 border border-primary/20">
                                <p className="font-display font-bold text-foreground">6 months</p>
                                <p className="text-xs text-muted-foreground">Rate reviews</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding section-alt text-center">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                        Ready to work with us?
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                        If this sounds like your kind of team, we'd love to hear from you.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/careers">
                            <Button size="lg">
                                See Open Roles <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/our-culture">
                            <Button size="lg" variant="outline">
                                Our Culture
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default WorkPolicy;
