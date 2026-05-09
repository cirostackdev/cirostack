"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Rocket, CalendarCheck, Briefcase, Newspaper, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import heroContact from "@/assets/hero-contact.jpg";

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
      <PageHero
        title="How can we help?"
        description="Choose the option that best fits what you're looking for."
        image={heroContact}
      />

      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {intents.map((item, i) => (
              <motion.div
                key={item.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className={`group relative p-8 rounded-2xl border flex flex-col justify-between gap-8 transition-all duration-300 hover:shadow-lg ${
                  item.highlight
                    ? "bg-primary text-primary-foreground border-primary"
                    : "surface-glass border-border hover:border-primary/40"
                }`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                    item.highlight ? "bg-white/20" : "bg-primary/10"
                  }`}>
                    <item.icon className={`w-6 h-6 ${item.highlight ? "text-white" : "text-foreground"}`} />
                  </div>
                  <h2 className={`text-xl font-display font-bold mb-2 ${item.highlight ? "text-white" : "text-foreground"}`}>
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

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center text-sm text-muted-foreground mt-10"
          >
            Not sure which option fits?{" "}
            <a href="mailto:contact@cirostack.com" className="text-primary hover:underline">
              Email us directly
            </a>{" "}
            and we'll route you to the right person.
          </motion.p>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
