"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, ArrowRight, Globe } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import SectionHeading from "@/components/SectionHeading";

type DbEvent = {
  id: string; type: string; title: string; description: string;
  date: string; time: string; location: string; attendees: number;
  featured: boolean; registrationUrl: string | null; imageUrl: string | null;
};

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const typeColors: Record<string, string> = {
    "Webinar":          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    "Conference Talk":  "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    "Conference":       "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    "Workshop":         "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

const pastHighlights = [
    { title: "DevWorld Summit 2025", attendees: "5,000+", talks: 3, year: "2025" },
    { title: "FinTech Forward Conference", attendees: "2,000+", talks: 1, year: "2025" },
    { title: "AI Innovation Week", attendees: "800+", talks: 2, year: "2024" },
];

const Events = ({ serverEvents }: { serverEvents: DbEvent[] }) => {
    const featured = serverEvents.filter(e => e.featured);
    const others = serverEvents.filter(e => !e.featured);

    const onlineCount = serverEvents.filter(e => e.location.toLowerCase().includes("online")).length;
    const inPersonCount = serverEvents.length - onlineCount;

    return (
        <Layout>
            <SEO
                title="Events, Webinars & Workshops"
                description="Join the CiroStack team at upcoming tech conferences, development workshops, and exclusive online webinars."
                url="/events"
            />

            {/* Upcoming Events */}
            <section id="events" className="section-padding mt-10">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeading badge="Upcoming Events" title="Don't miss these" description="Our most anticipated upcoming events. Spaces are limited — register early." />

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center py-10 mb-10 border-y border-border">
                        {[
                            { value: String(serverEvents.length), label: "Upcoming Events" },
                            { value: String(featured.length),     label: "Featured Events" },
                            { value: String(onlineCount),         label: "Online Sessions" },
                            { value: String(inPersonCount),       label: "In-Person Events" },
                        ].map((stat, i) => (
                            <motion.div key={stat.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                                <div className="text-4xl font-display font-bold text-foreground mb-2">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Featured — 2-col grid */}
                    {featured.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {featured.map((event, i) => (
                            <motion.div key={event.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="group rounded-2xl surface-glass hover-lift overflow-hidden flex flex-col">
                                {event.imageUrl && (
                                    <div className="h-52 overflow-hidden bg-secondary shrink-0">
                                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                    </div>
                                )}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${typeColors[event.type] ?? "bg-secondary text-muted-foreground"}`}>{event.type}</span>
                                        <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-md bg-secondary">Featured</span>
                                    </div>
                                    <h3 className="font-display font-semibold text-foreground text-xl mb-3 leading-snug group-hover:text-primary transition-colors">{event.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3 flex-1">{event.description}</p>
                                    <div className="space-y-1.5 mb-5">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="w-3.5 h-3.5 shrink-0" /><span>{event.date}{event.time ? ` · ${event.time}` : ""}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <MapPin className="w-3.5 h-3.5 shrink-0" /><span>{event.location}</span>
                                        </div>
                                        {event.attendees > 0 && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Users className="w-3.5 h-3.5 shrink-0" /><span>{event.attendees} registered</span>
                                            </div>
                                        )}
                                    </div>
                                    <Link href={event.registrationUrl ?? "#"}>
                                        <Button className="w-full">Register Now <ArrowRight className="ml-2 h-4 w-4" /></Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                        </div>
                    )}

                    {/* Other events — list */}
                    {others.length > 0 && (
                        <div className="space-y-4">
                            {others.map((event, i) => (
                                <motion.div key={event.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="rounded-2xl surface-glass hover-lift group overflow-hidden flex flex-col md:flex-row md:items-stretch">
                                    {event.imageUrl && (
                                        <div className="w-full md:w-36 h-40 md:h-auto shrink-0 overflow-hidden bg-secondary">
                                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                        </div>
                                    )}
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1 p-6">
                                        <div className="shrink-0">
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${typeColors[event.type] ?? "bg-secondary text-muted-foreground"}`}>{event.type}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">{event.title}</h3>
                                            <p className="text-sm text-muted-foreground">{event.description}</p>
                                        </div>
                                        <div className="flex flex-col md:items-end gap-1.5 shrink-0">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Calendar className="w-3.5 h-3.5" /><span>{event.date}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <MapPin className="w-3.5 h-3.5" /><span>{event.location}</span>
                                            </div>
                                            <Link href={event.registrationUrl ?? "#"}>
                                                <Button size="sm" variant="outline" className="mt-1">Register</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {serverEvents.length === 0 && (
                        <p className="text-center text-muted-foreground py-12">No upcoming events right now. Check back soon.</p>
                    )}
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
                    <Link href="/contact/press"><Button size="lg">Get in Touch <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                </div>
            </section>
        </Layout>
    );
};

export default Events;
