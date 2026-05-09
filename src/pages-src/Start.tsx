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

const Start = () => {
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
      toast({ title: "Project brief received!", description: "We'll send you a scoped proposal within 24 hours." });
      router.push("/thank-you");
    }, 1000);
  };

  return (
    <Layout>
      <section className="relative pt-24 pb-12 md:pt-0 md:pb-0 md:h-[calc(100dvh-5rem)] md:mt-20 md:flex md:items-center overflow-hidden">
        {/* Oblique sine wave background — right side */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="absolute inset-0 pointer-events-none hidden md:block" aria-hidden="true">
          <svg className="w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 700 0 C 650 150, 780 300, 700 450 C 620 600, 760 750, 700 900 L 1440 900 L 1440 0 Z"
              className="fill-primary"
            />
          </svg>
        </motion.div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="md:pr-16">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">Start Your Project</h1>
              <p className="text-muted-foreground leading-relaxed mb-10">Tell us what you're building. We'll respond within 24 hours with a fixed-price proposal — no vague estimates, no bait-and-switch.</p>
              <div className="divide-y divide-border">
                {[
                  { title: "We review your brief", body: "A senior engineer reads your submission — not a sales rep." },
                  { title: "Proposal in 24 hours", body: "You get a scoped proposal with a fixed price and timeline. No guesswork." },
                  { title: "You decide", body: "No pressure. Review the proposal and decide if we're the right fit." },
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
              <p className="mt-8 text-sm text-muted-foreground">
                Prefer email?{" "}
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
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Company</label>
                    <Input placeholder="Your startup or company" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                    <Input required type="email" placeholder="jane@startup.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
                    <Input type="tel" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">What are you building? *</label>
                  <Select required>
                    <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website / Landing Page</SelectItem>
                      <SelectItem value="webapp">Web Application</SelectItem>
                      <SelectItem value="mobile">Mobile App (iOS / Android)</SelectItem>
                      <SelectItem value="ai">AI / Automation Tool</SelectItem>
                      <SelectItem value="saas">SaaS Platform</SelectItem>
                      <SelectItem value="mvp">MVP / Prototype</SelectItem>
                      <SelectItem value="devops">DevOps / Cloud Infrastructure</SelectItem>
                      <SelectItem value="audit">Software Audit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Budget range</label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under5k">Under $5,000</SelectItem>
                        <SelectItem value="5k-15k">$5,000 – $15,000</SelectItem>
                        <SelectItem value="15k-30k">$15,000 – $30,000</SelectItem>
                        <SelectItem value="30k-60k">$30,000 – $60,000</SelectItem>
                        <SelectItem value="60k+">$60,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Timeline</label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select timeline" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">ASAP</SelectItem>
                        <SelectItem value="1-2months">1–2 months</SelectItem>
                        <SelectItem value="3-6months">3–6 months</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Describe your project *</label>
                  <Textarea required placeholder="What are you building, who is it for, and what problem does it solve?" rows={5} />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Project Brief"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Start;
