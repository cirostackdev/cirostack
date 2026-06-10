"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        try {
            const res = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) throw new Error();
            setSubmitted(true);
        } catch {
            setSubmitted(true);
        }
    };

    return (
        <Layout>
            <SEO
                title="CiroStack Digest Newsletter"
                description="Join 12,000+ readers getting weekly insights on software development, AI, and technology trends."
                url="/newsletter"
            />

            <section id="subscribe" className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
                <div className="w-full max-w-xl text-center">
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
        </Layout>
    );
};

export default Newsletter;
