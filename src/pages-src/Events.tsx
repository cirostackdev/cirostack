"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, ArrowRight, Globe, Video, Mic } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import heroEvents from "@/assets/hero-events.jpg";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const upcomingEvents = [
    {
        type: "Webinar",
        icon: Video,
        title: "AI Automation for Business Leaders",
        description: "A hands-on session covering practical AI implementation strategies for non-technical executives. Learn what's possible, what's hype, and how to get started.",
        date: "March 18, 2026",
        time: "2:00 PM EST",
        location: "Online (Zoom)",
        attendees: 320,
        featured: true,
    },
    {
        type: "Conference Talk",
        icon: Mic,
        title: "CiroStack at TechSummit 2026",
        description: "Our CTO will be presenting on the future of AI-assisted software development and what it means for engineering teams.",
        date: "April 5, 2026",
        time: "10:30 AM PST",
        location: "San Francisco, CA",
        attendees: 1200,
        featured: true,
    },
    {
        type: "Workshop",
        icon: Users,
        title: "Building Your MVP: From Idea to Launch",
        description: "An interactive half-day workshop walking founders through the CiroStack MVP methodology. Bring your idea and leave with a clear action plan.",
        date: "April 22, 2026",
        time: "9:00 AM GMT",
        location: "London, UK",
        attendees: 40,
        featured: false,
    },
    {
        type: "Webinar",
        icon: Video,
        title: "Cloud Migration Best Practices in 2026",
        description: "A deep-dive session with our cloud engineering team covering the latest patterns, tools, and pitfalls to avoid when migrating to the cloud.",
        date: "May 7, 2026",
        time: "1:00 PM EST",
        location: "Online (Zoom)",
        attendees: 180,
        featured: false,
    },
];

const pastHighlights = [
    { title: "DevWorld Summit 2025", attendees: "5,000+", talks: 3, year: "2025" },
    { title: "FinTech Forward Conference", attendees: "2,000+", talks: 1, year: "2025" },
    { title: "AI Innovation Week", attendees: "800+", talks: 2, year: "2024" },
];

const Events = () => {
    const featured = upcomingEvents.filter(e => e.featured);
    const others = upcomingEvents.filter(e => !e.featured);

    return (
        <Layout>
            <SEO
                title="Events, Webinars & Workshops"
                description="Join the CiroStack team at upcoming tech conferences, development workshops, and exclusive online webinars."
                url="/events"
            />
            <PageHero
                badge="Events"
                title="Connect with the"
                highlight="CiroStack team"
                description="Join us at webinars, workshops, and conferences. Learn from our team, connect with industry peers, and stay ahead of the technology curve."
                image={heroEvents}
                ctaText="See Upcoming Events"
                ctaLink="#events"
                secondaryCtaText="Contact Us"
                secondaryCtaLink="/contact"
            />

            {/* Featured Events */}
            <section id="events" className="section-padding">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading badge="Upcoming Events" title="Don't miss these" description="Our most anticipated upcoming events. Spaces are limited — register early." />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {featured.map((event, i) => (
                            <motion.div key={event.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-8 rounded-2xl surface-glass hover-lift group relative overflow-hidden">
                                <div className="absolute top-4 right-4">
                                    <span className="text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground font-medium">Featured</span>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                                    <event.icon className="w-6 h-6 text-foreground" />
                                </div>
                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{event.type}</span>
                                <h3 className="font-display font-semibold text-foreground text-xl mt-2 mb-3">{event.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{event.description}</p>
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <span>{event.attendees} registered</span>
                                    </div>
                                </div>
                                <Button className="w-full">Register Now <ArrowRight className="ml-2 h-4 w-4" /></Button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Other Events */}
                    <div className="space-y-4">
                        {others.map((event, i) => (
                            <motion.div key={event.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-6 rounded-2xl surface-glass hover-lift group flex flex-col md:flex-row md:items-center gap-5">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <event.icon className="w-6 h-6 text-foreground" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{event.type}</span>
                                    <h3 className="font-display font-semibold text-foreground text-lg mt-1 mb-2">{event.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                                </div>
                                <div className="flex flex-col md:items-end gap-2 shrink-0">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span>{event.location}</span>
                                    </div>
                                    <Button size="sm" variant="outline" className="mt-2">Register</Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Past highlights */}
            <section className="section-padding section-alt">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading badge="Past Events" title="Where we've been" description="CiroStack has spoken at and sponsored leading technology events worldwide." />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {pastHighlights.map((past, i) => (
                            <motion.div key={past.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-8 rounded-2xl surface-glass text-center">
                                <Globe className="w-8 h-8 text-foreground mx-auto mb-4" />
                                <p className="text-xs text-muted-foreground mb-2">{past.year}</p>
                                <h3 className="font-display font-semibold text-foreground text-lg mb-3">{past.title}</h3>
                                <div className="flex gap-6 justify-center text-center">
                                    <div>
                                        <p className="text-2xl font-display font-bold text-foreground">{past.attendees}</p>
                                        <p className="text-xs text-muted-foreground">Attendees</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-display font-bold text-foreground">{past.talks}</p>
                                        <p className="text-xs text-muted-foreground">Talks</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding text-center">
                <div className="container mx-auto px-4 md:px-6 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Want CiroStack at your event?</h2>
                    <p className="text-muted-foreground text-lg mb-8">Our team is available for speaking engagements, workshops, and panel discussions on software development, AI, and digital transformation.</p>
                    <Link href="/contact"><Button size="lg">Get in Touch <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                </div>
            </section>
        </Layout>
    );
};

export default Events;
