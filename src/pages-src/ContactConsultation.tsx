"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MessageSquare } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

const ContactConsultation = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tab, setTab] = useState<"calendly" | "form">(CALENDLY_URL ? "calendly" : "form");

  useEffect(() => {
    if (!CALENDLY_URL) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const [fields, setFields] = useState({
    name: "", email: "", company: "", timezone: "", timeOfDay: "", message: "",
  });

  const set = (k: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fields.name || !fields.email || !fields.timezone || !fields.message) {
      toast({ title: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error();
      router.push("/thank-you");
    } catch {
      toast({ title: "Something went wrong. Please try again or email us directly.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="relative pt-24 pb-12 md:pt-0 md:pb-0 md:h-screen md:pt-24 md:flex md:items-center overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="absolute inset-0 pointer-events-none hidden md:block" aria-hidden="true">
          <svg className="w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="contact-bg-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--gradient-start))" />
                <stop offset="100%" stopColor="hsl(var(--gradient-end))" />
              </linearGradient>
            </defs>
            <path d="M 695 0 C 645 150, 775 300, 695 450 C 615 600, 755 750, 695 900 L 1440 900 L 1440 0 Z" fill="url(#contact-bg-gradient)" />
          </svg>
          <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] rounded-full bg-accent/10 blur-3xl" />
        </motion.div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Info */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="md:pr-16">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">Book a Free Consultation</h1>
              <p className="text-muted-foreground leading-relaxed mb-10">A 30-minute call with a senior engineer. No sales pitch — just a straight conversation about your idea and whether we're the right fit.</p>
              <div className="divide-y divide-border mb-8">
                {[
                  "30 minutes, no prep required",
                  "You talk to an engineer, not a salesperson",
                  "We'll tell you honestly if we're not the right fit",
                  "No obligation to proceed after the call",
                  "Follow-up notes sent within 2 hours",
                ].map((item, i) => (
                  <div key={item} className="py-4 flex gap-6">
                    <span className="text-xs font-bold text-primary tabular-nums shrink-0 mt-0.5">0{i + 1}</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Ready to build instead?{" "}
                <a href="/start" className="text-primary hover:underline">Submit a project brief →</a>
              </p>
            </motion.div>

            {/* Form / Calendly */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}>

              {/* Tab switcher — only shown when Calendly is configured */}
              {CALENDLY_URL && (
                <div className="flex gap-2 mb-5">
                  <button
                    onClick={() => setTab("calendly")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "calendly" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                  >
                    <CalendarDays className="w-4 h-4" /> Pick a time slot
                  </button>
                  <button
                    onClick={() => setTab("form")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "form" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                  >
                    <MessageSquare className="w-4 h-4" /> Send a message
                  </button>
                </div>
              )}

              {/* Calendly embed */}
              {tab === "calendly" && CALENDLY_URL && (
                <div
                  className="calendly-inline-widget rounded-2xl overflow-hidden border border-border"
                  data-url={`${CALENDLY_URL}?hide_gdpr_banner=1`}
                  style={{ minWidth: "320px", height: "660px" }}
                />
              )}

              {/* Contact form */}
              {tab === "form" && (
              <form onSubmit={handleSubmit} className="surface-glass rounded-2xl p-6 md:p-8 space-y-4 md:space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Name *</label>
                    <Input required placeholder="Jane Smith" value={fields.name} onChange={set("name")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                    <Input required type="email" placeholder="jane@startup.com" value={fields.email} onChange={set("email")} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Company / Startup</label>
                  <Input placeholder="Optional" value={fields.company} onChange={set("company")} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Your time zone *</label>
                  <Select required value={fields.timezone} onValueChange={v => setFields(f => ({ ...f, timezone: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select time zone" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Eastern Time (ET)">Eastern Time (ET)</SelectItem>
                      <SelectItem value="Central Time (CT)">Central Time (CT)</SelectItem>
                      <SelectItem value="Mountain Time (MT)">Mountain Time (MT)</SelectItem>
                      <SelectItem value="Pacific Time (PT)">Pacific Time (PT)</SelectItem>
                      <SelectItem value="GMT / London">GMT / London</SelectItem>
                      <SelectItem value="Central European Time (CET)">Central European Time (CET)</SelectItem>
                      <SelectItem value="East Africa Time (EAT)">East Africa Time (EAT)</SelectItem>
                      <SelectItem value="West Africa Time (WAT)">West Africa Time (WAT)</SelectItem>
                      <SelectItem value="India Standard Time (IST)">India Standard Time (IST)</SelectItem>
                      <SelectItem value="Singapore / HKT">Singapore / HKT</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Preferred time of day</label>
                  <Select value={fields.timeOfDay} onValueChange={v => setFields(f => ({ ...f, timeOfDay: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning (8am–12pm)">Morning (8am–12pm)</SelectItem>
                      <SelectItem value="Afternoon (12pm–5pm)">Afternoon (12pm–5pm)</SelectItem>
                      <SelectItem value="Evening (5pm–8pm)">Evening (5pm–8pm)</SelectItem>
                      <SelectItem value="Any time">Any time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">What do you want to discuss? *</label>
                  <Textarea required placeholder="Briefly describe your idea, challenge, or question. A sentence or two is enough." rows={4} value={fields.message} onChange={set("message")} />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Request a Call"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
              )}

            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactConsultation;
