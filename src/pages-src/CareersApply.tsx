"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowRight, Upload, X, FileText } from "lucide-react";
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
  const cvInputRef = useRef<HTMLInputElement>(null);

  const [fields, setFields] = useState({
    fullName: "", email: "", role: prefilledRole,
    linkedin: "", github: "", experience: "", coverLetter: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);

  const set = (k: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields(f => ({ ...f, [k]: e.target.value }));

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      toast({ title: "CV must be a PDF or Word document.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "CV must be under 5 MB.", variant: "destructive" });
      return;
    }
    setCvFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fields.fullName || !fields.email || !fields.role || !fields.linkedin || !fields.github || !fields.experience || !fields.coverLetter) {
      toast({ title: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (!cvFile) {
      toast({ title: "Please attach your CV.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
      formData.append("cv", cvFile);

      const res = await fetch("/api/contact/careers", { method: "POST", body: formData });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      router.push("/thank-you");
    } catch (err: any) {
      toast({ title: err?.message || "Something went wrong. Please try again or email us directly.", variant: "destructive" });
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
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">Apply to CiroStack</h1>
              <p className="text-muted-foreground leading-relaxed mb-10">We review every application personally. If your skills and values align, you'll hear from us within 5 business days.</p>
              <div className="divide-y divide-border mb-8">
                {[
                  "Every application is read by a human",
                  "We respond to every applicant, accepted or not",
                  "Interview process is 2 rounds max — we respect your time",
                  "No unpaid take-home tests longer than 2 hours",
                  "Offer within 48 hours if it's a match",
                ].map((item, i) => (
                  <div key={item} className="py-4 flex gap-6">
                    <span className="text-xs font-bold text-primary tabular-nums shrink-0 mt-0.5">0{i + 1}</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Want to browse open roles first?{" "}
                <a href="/careers" className="text-primary hover:underline">View all positions →</a>
              </p>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}>
              <form onSubmit={handleSubmit} className="surface-glass rounded-2xl p-6 md:p-8 space-y-4 md:space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full name *</label>
                    <Input required placeholder="Jane Smith" value={fields.fullName} onChange={set("fullName")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                    <Input required type="email" placeholder="jane@email.com" value={fields.email} onChange={set("email")} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Role applying for *</label>
                  <Select required value={fields.role} onValueChange={v => setFields(f => ({ ...f, role: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                    <SelectContent>
                      {openRoles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">LinkedIn *</label>
                    <Input required type="url" placeholder="https://linkedin.com/in/you" value={fields.linkedin} onChange={set("linkedin")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">GitHub *</label>
                    <Input required type="url" placeholder="https://github.com/you" value={fields.github} onChange={set("github")} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Years of relevant experience *</label>
                  <Select required value={fields.experience} onValueChange={v => setFields(f => ({ ...f, experience: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0–1 years">0–1 years</SelectItem>
                      <SelectItem value="2–3 years">2–3 years</SelectItem>
                      <SelectItem value="4–6 years">4–6 years</SelectItem>
                      <SelectItem value="7–10 years">7–10 years</SelectItem>
                      <SelectItem value="10+ years">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* CV upload */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">CV / Resume * <span className="text-muted-foreground font-normal">(PDF or Word, max 5 MB)</span></label>
                  <input
                    ref={cvInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={handleCvChange}
                  />
                  {cvFile ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm text-foreground truncate flex-1">{cvFile.name}</span>
                      <button type="button" onClick={() => { setCvFile(null); if (cvInputRef.current) cvInputRef.current.value = ""; }}>
                        <X className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => cvInputRef.current?.click()}
                      className="w-full flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors text-muted-foreground"
                    >
                      <Upload className="w-5 h-5" />
                      <span className="text-sm">Click to upload your CV</span>
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Cover letter *</label>
                  <Textarea required placeholder="Why CiroStack? What have you built that you're most proud of? What excites you about this role?" rows={5} value={fields.coverLetter} onChange={set("coverLetter")} />
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
