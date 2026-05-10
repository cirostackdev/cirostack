"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const projectTypes = [
  { label: "Website / Landing Page", base: [3000, 12000] },
  { label: "Web Application", base: [15000, 50000] },
  { label: "Mobile App", base: [25000, 75000] },
  { label: "AI / Automation Tool", base: [20000, 80000] },
  { label: "SaaS Platform", base: [35000, 120000] },
  { label: "MVP / Prototype", base: [10000, 35000] },
  { label: "DevOps / Cloud", base: [5000, 20000] },
  { label: "Software Audit", base: [2500, 8000] },
] as const;

const featureOptions = [
  { label: "User authentication & accounts", add: [2000, 5000] },
  { label: "Payment processing", add: [3000, 8000] },
  { label: "Admin dashboard", add: [3000, 8000] },
  { label: "AI / ML features", add: [8000, 25000] },
  { label: "Third-party API integrations", add: [2000, 6000] },
  { label: "Real-time features (chat / notifications)", add: [4000, 10000] },
  { label: "Analytics & reporting", add: [3000, 8000] },
  { label: "Multi-language / localisation", add: [3000, 8000] },
];

const timelineOptions = [
  { label: "ASAP", note: "Rush rate applies", multiplier: 1.2 },
  { label: "1–2 months", note: "Standard rate", multiplier: 1.0 },
  { label: "3–6 months", note: "Slightly discounted", multiplier: 0.95 },
  { label: "Flexible", note: "Best value", multiplier: 0.9 },
];

function fmt(n: number) {
  return "$" + Math.round(n / 1000) * 1000 >= 10000
    ? "$" + (Math.round(n / 1000) * 1000).toLocaleString()
    : "$" + Math.round(n / 500) * 500;
}

const ResourcesEstimate = () => {
  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("");

  const toggleFeature = (label: string) =>
    setFeatures(f => f.includes(label) ? f.filter(x => x !== label) : [...f, label]);

  const calculate = () => {
    const pt = projectTypes.find(p => p.label === projectType);
    if (!pt) return null;
    let [lo, hi] = [...pt.base] as [number, number];
    for (const f of featureOptions) {
      if (features.includes(f.label)) {
        lo += f.add[0];
        hi += f.add[1];
      }
    }
    const tl = timelineOptions.find(t => t.label === timeline);
    const m = tl?.multiplier ?? 1;
    return { lo: Math.round(lo * m), hi: Math.round(hi * m), timeline: tl?.label };
  };

  const result = step === 3 ? calculate() : null;

  return (
    <Layout>
      <section className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 max-w-2xl relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              <Calculator className="w-3.5 h-3.5" /> Project Estimate Calculator
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              How much will your project cost?
            </h1>
            <p className="text-muted-foreground">
              Answer 3 quick questions and get a ballpark range in seconds. For a precise fixed-price quote, <Link href="/start" className="text-primary hover:underline">submit a project brief</Link>.
            </p>
          </div>

          {/* Progress */}
          {step < 3 && (
            <div className="flex gap-2 mb-8">
              {[0, 1, 2].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? "bg-primary" : "bg-secondary"}`} />
              ))}
            </div>
          )}

          {/* Steps */}
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
                <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Step 1 of 3 — Project Type</p>
                <h2 className="text-xl font-display font-semibold text-foreground mb-6">What are you building?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projectTypes.map(pt => (
                    <button
                      key={pt.label}
                      onClick={() => setProjectType(pt.label)}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                        projectType === pt.label
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border surface-glass text-foreground hover:border-primary/40"
                      }`}
                    >
                      <p className="font-medium text-sm">{pt.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {fmt(pt.base[0])} – {fmt(pt.base[1])}
                      </p>
                    </button>
                  ))}
                </div>
                <Button
                  className="mt-8 w-full"
                  size="lg"
                  disabled={!projectType}
                  onClick={() => setStep(1)}
                >
                  Next: Features <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
                <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Step 2 of 3 — Features</p>
                <h2 className="text-xl font-display font-semibold text-foreground mb-2">Which features do you need?</h2>
                <p className="text-sm text-muted-foreground mb-6">Select all that apply. Leave blank if unsure.</p>
                <div className="space-y-3">
                  {featureOptions.map(f => (
                    <button
                      key={f.label}
                      onClick={() => toggleFeature(f.label)}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all duration-200 ${
                        features.includes(f.label)
                          ? "border-primary bg-primary/5"
                          : "border-border surface-glass hover:border-primary/40"
                      }`}
                    >
                      <span className="text-sm font-medium text-foreground">{f.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">+{fmt(f.add[0])}–{fmt(f.add[1])}</span>
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${features.includes(f.label) ? "bg-primary border-primary" : "border-border"}`}>
                          {features.includes(f.label) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-8">
                  <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(0)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button size="lg" className="flex-1" onClick={() => setStep(2)}>
                    Next: Timeline <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
                <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Step 3 of 3 — Timeline</p>
                <h2 className="text-xl font-display font-semibold text-foreground mb-6">When do you need it?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {timelineOptions.map(tl => (
                    <button
                      key={tl.label}
                      onClick={() => setTimeline(tl.label)}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                        timeline === tl.label
                          ? "border-primary bg-primary/5"
                          : "border-border surface-glass hover:border-primary/40"
                      }`}
                    >
                      <p className="font-medium text-sm text-foreground">{tl.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{tl.note}</p>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-8">
                  <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button size="lg" className="flex-1" disabled={!timeline} onClick={() => setStep(3)}>
                    See Estimate <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && result && (
              <motion.div key="step3" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
                <div className="surface-glass rounded-2xl p-8 text-center mb-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Estimated Range</p>
                  <p className="text-5xl font-display font-bold text-foreground mb-2">
                    {fmt(result.lo)} – {fmt(result.hi)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Based on: {projectType}{features.length > 0 ? `, ${features.length} feature${features.length > 1 ? "s" : ""}` : ""}, {result.timeline}
                  </p>
                </div>

                <div className="surface-glass rounded-2xl p-6 mb-6 space-y-2 text-sm">
                  <p className="font-semibold text-foreground mb-3">What's included in this estimate</p>
                  <div className="flex items-start gap-2 text-muted-foreground"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span>Project type: {projectType}</span></div>
                  {features.map(f => (
                    <div key={f} className="flex items-start gap-2 text-muted-foreground"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span>{f}</span></div>
                  ))}
                  <div className="flex items-start gap-2 text-muted-foreground"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span>Timeline: {result.timeline}</span></div>
                </div>

                <p className="text-xs text-muted-foreground text-center mb-6">
                  This is a ballpark estimate. The actual price depends on your exact requirements. Get a fixed-price proposal with no obligation.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/start" className="flex-1">
                    <Button size="lg" className="w-full">Get a Fixed-Price Quote <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                  <Button variant="outline" size="lg" className="flex-1" onClick={() => { setStep(0); setProjectType(""); setFeatures([]); setTimeline(""); }}>
                    Start Over
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
};

export default ResourcesEstimate;
