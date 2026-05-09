"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

const openRoles = [
  "Senior Full-Stack Engineer",
  "AI/ML Engineer",
  "Senior Product Designer",
  "DevOps / Cloud Engineer",
  "Business Development Manager",
  "Technical Project Manager",
  "React Native Developer (Contract)",
  "Open Application",
];

const CareersApply = () => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledRole = searchParams.get("role") ?? "";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({ title: "Application received!", description: "We'll review your application and get back to you within 5 business days." });
      router.push("/thank-you");
    }, 1000);
  };

  return (
    <Layout>
      <section className="pt-32 pb-10 md:pt-40 md:pb-14 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Briefcase className="w-6 h-6 text-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">Apply to CiroStack</h1>
          <p className="text-muted-foreground leading-relaxed">We review every application personally. If your skills and values align, you'll hear from us within 5 business days.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">Our hiring promise</h2>
              <div className="space-y-5 mb-8">
                {[
                  "Every application is read by a human",
                  "We respond to every applicant, accepted or not",
                  "Interview process is 2 rounds max — we respect your time",
                  "No unpaid take-home tests longer than 2 hours",
                  "Offer within 48 hours if it's a match",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Want to browse open roles first?{" "}
                <a href="/careers" className="text-primary hover:underline">
                  View all positions →
                </a>
              </p>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <form onSubmit={handleSubmit} className="surface-glass rounded-2xl p-8 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full name *</label>
                    <Input required placeholder="Jane Smith" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                    <Input required type="email" placeholder="jane@email.com" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Role applying for *</label>
                  <Select required defaultValue={prefilledRole}>
                    <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                    <SelectContent>
                      {openRoles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">LinkedIn profile</label>
                    <Input type="url" placeholder="https://linkedin.com/in/you" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Portfolio / GitHub</label>
                    <Input type="url" placeholder="https://github.com/you" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Years of relevant experience *</label>
                  <Select required>
                    <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0–1 years</SelectItem>
                      <SelectItem value="2-3">2–3 years</SelectItem>
                      <SelectItem value="4-6">4–6 years</SelectItem>
                      <SelectItem value="7-10">7–10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Cover letter *</label>
                  <Textarea
                    required
                    placeholder="Why CiroStack? What have you built that you're most proud of? What excites you about this role?"
                    rows={5}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">How did you hear about us?</label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="google">Google Search</SelectItem>
                      <SelectItem value="twitter">X / Twitter</SelectItem>
                      <SelectItem value="blog">CiroStack Blog</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CareersApply;
