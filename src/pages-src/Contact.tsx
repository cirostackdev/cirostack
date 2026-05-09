"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Rocket, CalendarCheck, Briefcase, Newspaper, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08 } }),
};

const intents = [
  {
    icon: Rocket,
    label: "Start a Project",
    description: "Ready to build? Tell us what you need and get a fixed-price proposal within 24 hours.",
    cta: "Get a Quote",
    href: "/start",
    highlight: true,
  },
  {
    icon: CalendarCheck,
    label: "Book a Consultation",
    description: "Still exploring? Book a free 30-minute call to talk through your idea with a senior engineer.",
    cta: "Book a Call",
    href: "/contact/consultation",
  },
  {
    icon: Briefcase,
    label: "Apply for a Role",
    description: "Want to join CiroStack? Browse open roles and submit your application directly.",
    cta: "View Open Roles",
    href: "/careers",
  },
  {
    icon: Newspaper,
    label: "Press & Speaking",
    description: "Media inquiries, speaking engagements, workshops, or partnership requests.",
    cta: "Get in Touch",
    href: "/contact/press",
  },
];

const Contact = () => {
  return (
    <Layout>
      <section className="relative pt-24 pb-12 md:pt-0 md:pb-0 md:h-screen md:pt-24 md:flex md:flex-col md:justify-center overflow-hidden">
        {/* Oblique sine wave background — right side */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="absolute inset-0 pointer-events-none hidden md:block" aria-hidden="true">
          <svg className="w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="contact-bg-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--gradient-start))" />
                <stop offset="100%" stopColor="hsl(var(--gradient-end))" />
              </linearGradient>
            </defs>
            <path
              d="M 695 0 C 645 150, 775 300, 695 450 C 615 600, 755 750, 695 900 L 1440 900 L 1440 0 Z"
              fill="url(#contact-bg-gradient)"
            />
          </svg>
          <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] rounded-full bg-accent/10 blur-3xl" />
        </motion.div>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-10 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">How can we help?</h1>
            <p className="text-muted-foreground leading-relaxed">Choose the option that best fits what you're looking for.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-x-[7.5rem] md:gap-y-10">
            {intents.map((item, i) => (
              <motion.div
                key={item.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className={`group relative p-5 md:p-6 rounded-2xl border flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-lg ${
                  item.highlight
                    ? "bg-primary text-primary-foreground border-primary"
                    : "surface-glass border-border hover:border-primary/40"
                }`}
              >
                <div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    item.highlight ? "bg-white/20" : "bg-primary/10"
                  }`}>
                    <item.icon className={`w-5 h-5 ${item.highlight ? "text-white" : "text-foreground"}`} />
                  </div>
                  <h2 className={`text-lg font-display font-bold mb-1 ${item.highlight ? "text-white" : "text-foreground"}`}>
                    {item.label}
                  </h2>
                  <p className={`text-sm leading-relaxed ${item.highlight ? "text-white/80" : "text-muted-foreground"}`}>
                    {item.description}
                  </p>
                </div>
                <Link href={item.href}>
                  <Button
                    size="sm"
                    variant={item.highlight ? "secondary" : "default"}
                    className="group-hover:gap-2 transition-all"
                  >
                    {item.cta} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
