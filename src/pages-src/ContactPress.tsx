"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

const ContactPress = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      toast({ title: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({ title: "Request received!", description: "Our press team will respond within 48 hours." });
      router.push("/thank-you");
    }, 1000);
  };

  return (
    <Layout>
      <section className="relative pt-24 pb-12 md:pt-0 md:pb-0 md:h-screen md:pt-24 md:flex md:items-center overflow-hidden">
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
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Info */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="md:pr-16">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">Press & Speaking</h1>
              <p className="text-muted-foreground leading-relaxed mb-10">Media inquiries, speaking engagements, and panel discussions.</p>
              <div className="divide-y divide-border mb-8">
                {[
                  { title: "Press & Media", body: "Interviews, quotes, expert commentary on software, AI, and African tech." },
                  { title: "Speaking Engagements", body: "Keynotes and talks on startup software development, AI, and building distributed engineering teams." },
                  { title: "Panel Discussions", body: "Founders, tech leaders, and investors — we're available for curated panels on relevant topics." },
                ].map(({ title, body }, i) => (
                  <div key={title} className="py-5 flex gap-6">
                    <span className="text-xs font-bold text-primary tabular-nums shrink-0 mt-0.5">0{i + 1}</span>
                    <div>
                      <p className="font-semibold text-foreground mb-1">{title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Direct press contact:{" "}
                <a href="mailto:contact@cirostack.com" className="text-primary hover:underline">
                  contact@cirostack.com
                </a>
              </p>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}>
              <form onSubmit={handleSubmit} noValidate className="surface-glass rounded-2xl p-6 md:p-8 space-y-4 md:space-y-5 ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Name *</label>
                    <Input required placeholder="Jane Smith" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                    <Input required type="email" placeholder="jane@outlet.com" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Organisation / Outlet *</label>
                  <Input required placeholder="e.g. TechCrunch, YC, ALX Africa" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Request type *</label>
                  <Select required>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="press">Press / Media Inquiry</SelectItem>
                      <SelectItem value="speaking">Speaking Engagement</SelectItem>
                      <SelectItem value="panel">Panel Discussion</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Event / Deadline date</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Details *</label>
                  <Textarea
                    required
                    placeholder="Tell us about the event, publication, or opportunity. Include audience size, format, and any relevant context."
                    rows={5}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Request"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPress;
