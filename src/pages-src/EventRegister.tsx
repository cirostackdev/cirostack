"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { events } from "@/data/events";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.1 } }),
};

function EventRegisterInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const eventId = searchParams.get("event") ?? "";
  const event = events.find((e) => e.id === eventId) ?? events[0];

  const [fields, setFields] = useState({ name: "", email: "", company: "" });
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.name || !fields.email) {
      toast({ title: "Please fill in your name and email.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          eventTitle: event.title,
          eventDate: event.date,
          eventLocation: event.location,
        }),
      });
      if (!res.ok) throw new Error();
      router.push("/thank-you");
    } catch {
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="relative pt-24 pb-16 md:min-h-screen md:flex md:items-center overflow-hidden">
        {/* Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 pointer-events-none hidden md:block"
          aria-hidden="true"
        >
          <svg className="w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="event-bg-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--gradient-start))" />
                <stop offset="100%" stopColor="hsl(var(--gradient-end))" />
              </linearGradient>
            </defs>
            <path d="M 695 0 C 645 150, 775 300, 695 450 C 615 600, 755 750, 695 900 L 1440 900 L 1440 0 Z" fill="url(#event-bg-gradient)" />
          </svg>
          <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        </motion.div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Event details */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="md:pr-8"
            >
              <span className="text-xs font-medium text-primary uppercase tracking-widest mb-3 block">
                {event.type}
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 leading-tight">
                {event.title}
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8">{event.description}</p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: Calendar, label: event.date },
                  { icon: Clock, label: event.time },
                  { icon: MapPin, label: event.location },
                  { icon: Users, label: `${event.attendees.toLocaleString()} registered` },
                ].map(({ icon: Icon, label }, i) => (
                  <motion.div
                    key={label}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={i}
                    className="flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{label}</span>
                  </motion.div>
                ))}
              </div>

              <div className="rounded-xl border border-border p-5 bg-muted/30">
                <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  What you get
                </p>
                <ul className="space-y-2">
                  {[
                    "Confirmation email with joining instructions",
                    "Reminder 24 hours before the event",
                    "Access to the recording after the event",
                    "Q&A session with the CiroStack team",
                  ].map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5 shrink-0">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Registration form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="surface-glass rounded-2xl p-6 md:p-8 space-y-5">
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground mb-1">Reserve your spot</h2>
                  <p className="text-sm text-muted-foreground">Free — takes 30 seconds.</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Full name *</label>
                  <Input required placeholder="Jane Smith" value={fields.name} onChange={set("name")} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Work email *</label>
                  <Input required type="email" placeholder="jane@startup.com" value={fields.email} onChange={set("email")} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Company / Startup</label>
                  <Input placeholder="Optional" value={fields.company} onChange={set("company")} />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? "Registering..." : "Register for Free"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  No spam. You'll only receive event communications.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default function EventRegister() {
  return (
    <Suspense fallback={null}>
      <EventRegisterInner />
    </Suspense>
  );
}
