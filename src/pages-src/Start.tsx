"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Rocket, Mail, Clock, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

const Start = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({ title: "Project brief received!", description: "We'll send you a scoped proposal within 24 hours." });
      router.push("/thank-you");
    }, 1000);
  };

  return (
    <Layout>
      <section className="pt-32 pb-10 md:pt-40 md:pb-14 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Rocket className="w-6 h-6 text-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">Start Your Project</h1>
          <p className="text-muted-foreground leading-relaxed">Tell us what you're building. We'll respond within 24 hours with a fixed-price proposal — no vague estimates, no bait-and-switch.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">What happens next</h2>
              <div className="space-y-6">
                {[
                  { icon: Rocket, title: "We review your brief", body: "A senior engineer reads your submission — not a sales rep." },
                  { icon: Clock, title: "Proposal in 24 hours", body: "You get a scoped proposal with a fixed price and timeline. No guesswork." },
                  { icon: Mail, title: "You decide", body: "No pressure. Review the proposal and decide if we're the right fit." },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                      <p className="text-muted-foreground text-sm">{body}</p>
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <form onSubmit={handleSubmit} className="surface-glass rounded-2xl p-8 space-y-5">
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
